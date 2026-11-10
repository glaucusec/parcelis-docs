---
title: Deploy with Docker Compose
slug: /deploy-with-docker-compose
---
Docker Compose is the recommended way to deploy Parcelis for a full production-style environment because it starts the application, PostgreSQL, Redis, and MinIO together and runs the migration and storage initialization steps automatically.

:::danger
**Existing PostgreSQL 16 installations**

The supplied Compose files now require PostgreSQL 18. **Before running `up` with the updated files, follow [Upgrade PostgreSQL 16 to 18](upgrade-postgresql.md).** Prisma migrations do not upgrade the database server. Existing volumes are preserved, and startup is blocked until the data migration is verified.
:::
Documentation is hosted independently at [docs.parcelis.dev](https://docs.parcelis.dev/). New releases no longer publish or run `parcelis/docs`; application `/docs` links redirect to the hosted site. When upgrading, use `--remove-orphans` with `docker compose up` to remove the old docs container.

## Requirements

To run the Parcelis platform, the minimum requirements are simply those required to install and run Docker. For production deployments, we recommend a Linux host with a supported Docker engine and Compose v2 installation.

## Setting up Parcelis

Choose the exact release tag or full commit for your deployment. Download the Compose file and environment template from that same revision:

```bash
PARCELIS_REF='<release-tag-or-full-commit>'
curl -fL "https://raw.githubusercontent.com/parcelis/parcelis/${PARCELIS_REF}/docker-compose.yml" -o docker-compose.yml
curl -fL "https://raw.githubusercontent.com/parcelis/parcelis/${PARCELIS_REF}/.env.production.example" -o .env.production.example
```

Replace the placeholder before running these commands. The updated Compose file uses `latest` for Parcelis application images, including `parcelis/apps`, `parcelis/worker`, and `parcelis/proxy`. Remove the obsolete `PARCELIS_VERSION` entry from an existing `.env.production`; it no longer selects image tags. Use deployment files and matching app/proxy images that include direct proxy routing from [application PR #582](https://github.com/parcelis/parcelis/pull/582). Older releases require their matching deployment files. Use the same `PARCELIS_REF` for the [PostgreSQL migration helper](upgrade-postgresql.md#before-migrating-to-postgresql-18).

Use the general `docker compose pull` commands only when all images required by the selected Compose file are available. This includes `parcelis/worker:latest` and matching `parcelis/apps:latest` and `parcelis/proxy:latest` images from that revision. If the selected Compose file includes `docs-service`, the matching `parcelis/docs:latest` image must also be published; it is not required when `docs-service` is absent. Until then, use the local-build steps below.

For local builds, run these commands from the application checkout at the selected commit. Build every application image with the `latest` tag, including the worker:

```bash
docker build --target app -f Dockerfile.app -t parcelis/apps:latest .
docker build --target worker -f Dockerfile.app -t parcelis/worker:latest .
docker build --target proxy -f infra/docker/proxy/Dockerfile -t parcelis/proxy:latest .
```

If the selected Compose file includes `docs-service`, also build its image from that checkout:

```bash
docker build --target nginx -f apps/docs/Dockerfile -t parcelis/docs:latest .
```

For a new installation, configure the environment file before starting the stack. Existing deployments must retain their saved `.env.production` and secrets.

```bash
cp .env.production.example .env.production
# edit .env.production with your production values
```

For a new installation using local builds, pull only the infrastructure images, then start the locally built application images without pulling replacements. For existing deployments, follow [Upgrading an existing deployment](#upgrading-an-existing-deployment) instead:

```bash
docker compose --env-file .env.production pull postgres-service redis-service minio-service minio-init-service
docker compose --env-file .env.production up -d --pull never --remove-orphans
```

Skip the general `pull` command below when using local builds: it would replace your local `latest` images with published images. The optional single-image stack instead uses `parcelis/parcelis` for both application and worker; see [Deploy with the Single-Image Docker Build](deploy-with-docker-compose-single-image.md).

Only after all images required by the selected Compose file are available as described above, pull and start the stack:

```bash
docker compose --env-file .env.production pull
docker compose --env-file .env.production up -d --remove-orphans
```

The stack will run the migration job first, then start the application and worker services once the database and object storage are ready.

Sign-ins use NextAuth JWT sessions with a seven-day rolling expiry and no inactivity timeout. NextAuth renews sessions through its session endpoints. Cookies from the previous session implementation require signing in again with existing credentials.

:::warning
If you are planning to run Parcelis in a production environment, update the values in the secrets, authentication, and transactional email sections of `.env.production` before you go live. Use strong, unique values for the database, MinIO, SMTP, and authentication settings so only you can access the platform services.
:::
## Configure transactional email

Password reset links use the SMTP values in `.env.production` until an organization has saved its own SMTP configuration. Set `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASSWORD` for this fallback configuration. `SMTP_SECURE` must be `true` or `false`; use `true` for implicit TLS (commonly port 465). Organization administrators can reset their saved SMTP configuration in Settings → Organization → Email to return to these deployment settings. See [Email configuration](email-configuration.md) for the full `.env` reference.

Set `EMAIL_SETTINGS_ENCRYPTION_KEY` to a base64-encoded 32-byte secret before saving organization SMTP passwords. Keep this value stable and available to every API and worker instance; changing it prevents the app from decrypting existing organization SMTP passwords.

## What the stack does

- `migrate` runs Prisma migrations before the app starts
- `minio-init` creates the object-storage buckets and uploads public brand assets
- `app` runs the web UI and API under Supervisor, without nginx
- `proxy` routes requests directly to the web and API listeners and waits for app health before starting
- `worker` uses the dedicated `parcelis/worker` image to dispatch outbox events and process jobs

## API runtime

The application container runs the Next.js web app and API as separate processes under
Supervisor. The separate `parcelis/proxy` container owns HTTP routing; there is no nginx
inside the modular app image. Background jobs, PostgreSQL, Redis, and object storage keep
their existing roles.

| Public path | Upstream in the modular stack |
| --- | --- |
| `/` and other web paths | Web process at `app-service:3001` |
| `/api/*`, including NextAuth | API process at `app-service:4000` |
| `/trpc/*` and `/admin/jobs/*` | API process at `app-service:4000` |
| `/healthz` | API `/api/v1/health` |
| `/docs/*`, when `docs-service` is configured | Documentation container, with the `/docs/` prefix removed |

The supplied Compose file publishes only the proxy's HTTP port through `APP_PORT`. Web and
API ports remain on the container network. Keep those listeners private to the proxy.
The app health check requests both processes directly; the proxy health check requests web
and API paths through nginx. These checks establish HTTP liveness and routing, rather than
full dependency readiness. The proxy's startup dependency does not automatically stop or
restart it when the app later becomes unhealthy.

Both application Docker targets set `API_INTERNAL_URL` to the API loopback address and
configured port. Web middleware uses it to check organization access. Avoid overriding it
with a development URL such as `http://localhost:40010` in a container.

The default API listener is `4000`. If changing the `API_INTERNAL_PORT` build argument,
supply the same value when building the app and proxy images. The web listener stays on
`3001`. The [single-image deployment](deploy-with-docker-compose-single-image.md) retains
its own nginx and loopback application listeners.

The modular app image excludes the worker. Build `parcelis/worker` with the
`worker` target in the same `Dockerfile.app`; this target builds only the worker
and its shared packages. It starts Node directly, has no web HTTP health check,
and reports readiness through Redis heartbeats and canary jobs in the
[status monitor](status-monitor.md). A running container alone does not confirm job
processing. Compose waits for successful migrations and healthy Redis, exposes no
worker port, and allows 25 seconds for graceful shutdown. Keep the app and worker
on the `latest` tag. The single-image stack continues to bundle the worker in
`parcelis/parcelis` and does not require `parcelis/worker`.

The supplied `.env.production.example` sets `API_TRUST_PROXY_HOPS=1` for the one nginx
hop between the browser and API. Existing environment files override Compose defaults;
change the old value of `2` to `1` when moving to this topology. This setting controls
forwarded client IPs, including rate limits. If another trusted reverse proxy sits in
front, configure the count for that actual request path and restrict direct API access.
The API's own default outside Compose remains `0`, which ignores forwarded client IPs.
Invalid values fail API startup; restart the app after changing the count.

## Verify the deployment

After the containers are running, confirm the expected services are healthy:

```bash
docker compose --env-file .env.production ps
```

Open the web app through the proxy and verify sign-in, organization-scoped pages, `/api/v1/health`, `/healthz`, and the embedded job dashboard. Check `/docs/` according to the documentation routing in your selected proxy configuration. If organization pages redirect back to the portfolio, verify that the app uses the image-provided `API_INTERNAL_URL`. If you need to stop the stack later, run:

```bash
docker compose --env-file .env.production down
```

## NextAuth configuration

Set `NEXTAUTH_URL` in `.env.production` to the public Parcelis origin, including HTTPS. Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32` and use the same value across web and API instances. The Compose stack forwards both settings to the application container. Changing the secret invalidates NextAuth cookies. Cookie names, host scoping, and Secure behavior use NextAuth defaults based on the HTTP/HTTPS public URL; no `AUTH_COOKIE_*` settings are needed. Existing accounts and passwords continue to work; registration, email verification, and password recovery are unchanged.

## Upgrading an existing deployment

### Moving to direct proxy routing

Upgrade the app and proxy as a matching pair from the same application revision. The old
proxy/app pair routes through app port `3000`; the new proxy connects directly to `3001`
and the configured API port. Mixing these configurations can produce gateway failures.

1. Build the matching app and proxy images, or obtain the matching published images before
   stopping the existing services. Use the local-build steps above when compatible published
   images are unavailable.
2. Preserve saved secrets and environment settings. For the supplied one-proxy topology,
   set `API_TRUST_PROXY_HOPS=1` in the actual `.env.production` file.
3. Drain public traffic, then recreate the app and proxy together. For local builds or images
   already selected locally, do not pull application replacements:

```bash
docker compose --env-file .env.production stop app-service proxy-service
docker compose --env-file .env.production up -d --pull never --remove-orphans
```

4. Confirm both services are healthy and verify the public routes before restoring traffic.

Routing alone introduces no database schema changes. For rollback, restore the previous
compatible app/proxy pair and its corresponding proxy-count setting. The following database
and authentication guidance applies separately when the selected application upgrade includes
those changes.

### Database and authentication upgrades

The NextAuth upgrade removes the database `Session` table. Previous application instances still query that table, so this upgrade requires a maintenance window; do not apply migrations while old instances are serving requests.

Back up PostgreSQL, remove all application replicas from your load balancer, and wait for in-flight requests to finish. Stop every old application and worker instance, including instances on other hosts, before running the migration. Keep PostgreSQL, Redis, and object storage running.

For published images, set `PARCELIS_IMAGE_TAG` to the exact published release tag matching `PARCELIS_REF`, rather than `latest`. Pull that tag for every Parcelis image referenced as `latest` by the selected Compose file, then retag each image locally for Compose. This includes `parcelis/docs` only when `docs-service` is present. If matching release tags are unavailable, use the local-build upgrade sequence below. Do not run a general `docker compose pull` after retagging.

```bash
PARCELIS_IMAGE_TAG='<published-release-tag>'
parcelis_images=$(docker compose --env-file .env.production config --images) || exit 1
for image in $(printf '%s\n' "$parcelis_images" | sort -u); do
  case "$image" in
    parcelis/*:latest)
      release_image="${image%:latest}:${PARCELIS_IMAGE_TAG}"
      docker pull "$release_image" || exit 1
      docker tag "$release_image" "$image" || exit 1
      ;;
  esac
done
docker compose --env-file .env.production pull postgres-service redis-service minio-service minio-init-service
docker compose --env-file .env.production stop app-service proxy-service worker-service
docker compose --env-file .env.production run --rm --no-deps --pull never migrate-service
docker compose --env-file .env.production up -d --pull never --remove-orphans
```

For locally built application images, use the same maintenance ordering and pull only infrastructure images:

```bash
docker compose --env-file .env.production pull postgres-service redis-service minio-service minio-init-service
docker compose --env-file .env.production stop app-service proxy-service worker-service
docker compose --env-file .env.production run --rm --no-deps --pull never migrate-service
docker compose --env-file .env.production up -d --pull never --remove-orphans
```

If migration fails, keep application traffic disabled until the failure is resolved. After the new application passes health checks, restore traffic. Users must sign in again. The previous release cannot run against the migrated database; reverting requires restoring the pre-upgrade database backup.
