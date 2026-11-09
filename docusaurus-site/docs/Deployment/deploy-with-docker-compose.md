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

Replace the placeholder before running these commands. The updated Compose file uses `latest` for Parcelis application images, including `parcelis/apps`, `parcelis/worker`, and `parcelis/proxy`. Remove the obsolete `PARCELIS_VERSION` entry from an existing `.env.production`; it no longer selects image tags. Use deployment files that include the dedicated worker change. Older releases require their matching deployment files. Use the same `PARCELIS_REF` for the [PostgreSQL migration helper](upgrade-postgresql.md#before-migrating-to-postgresql-18).

Until `parcelis/worker:latest` and matching `parcelis/apps:latest` and `parcelis/proxy:latest` images from that revision are published, use the local-build steps below. Do not use the general `docker compose pull` commands until all three matching images are available.

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

Only after the worker and matching application images are published, pull and start the stack:

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
- `app` serves the web UI and API
- `worker` uses the dedicated `parcelis/worker` image to dispatch outbox events and process jobs

## API runtime

The application container runs the Next.js web app and a separate Next.js API
process behind nginx. Background jobs run in the worker service; PostgreSQL, Redis,
and MinIO provide the database, queues, and object storage.

The modular app image excludes the worker. Build `parcelis/worker` with the
`worker` target in the same `Dockerfile.app`; this target builds only the worker
and its shared packages. It starts Node directly, has no web HTTP health check,
and reports readiness through Redis heartbeats and canary jobs in the
[status monitor](status-monitor.md). A running container alone does not confirm job
processing. Compose waits for successful migrations and healthy Redis, exposes no
worker port, and allows 25 seconds for graceful shutdown. Keep the app and worker
on the `latest` tag. The single-image stack continues to bundle the worker in
`parcelis/parcelis` and does not require `parcelis/worker`.

The supplied `.env.production.example` sets `API_TRUST_PROXY_HOPS` to `2` for the
two nginx proxies in this stack. Keep this value only when API traffic exclusively
passes through those proxies and direct access to the application container is
restricted. Adjust the count if your deployment changes the proxy path. The application
default is `0`, which ignores forwarded client IPs.
Invalid values fail API startup. Restart the API after changing the trusted proxy count.

## Verify the deployment

After the containers are running, confirm the expected services are healthy:

```bash
docker compose --env-file .env.production ps
```

Then open the public URLs for your deployed web app and docs site. If you need to stop the stack later, run:

```bash
docker compose --env-file .env.production down
```

## NextAuth configuration

Set `NEXTAUTH_URL` in `.env.production` to the public Parcelis origin, including HTTPS. Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32` and use the same value across web and API instances. The Compose stack forwards both settings to the application container. Changing the secret invalidates NextAuth cookies. Cookie names, host scoping, and Secure behavior use NextAuth defaults based on the HTTP/HTTPS public URL; no `AUTH_COOKIE_*` settings are needed. Existing accounts and passwords continue to work; registration, email verification, and password recovery are unchanged.

## Upgrading an existing deployment

The NextAuth upgrade removes the database `Session` table. Previous application instances still query that table, so this upgrade requires a maintenance window; do not apply migrations while old instances are serving requests.

Back up PostgreSQL, remove all application replicas from your load balancer, and wait for in-flight requests to finish. Stop every old application and worker instance, including instances on other hosts, before running the migration. Keep PostgreSQL, Redis, and object storage running.

Until the worker and matching application images are published, use the local-build upgrade sequence below. Once all matching images are published:

```bash
docker compose --env-file .env.production pull
docker compose --env-file .env.production stop app-service worker-service
docker compose --env-file .env.production run --rm --no-deps migrate-service
docker compose --env-file .env.production up -d --remove-orphans
```

For locally built application images, use the same maintenance ordering and pull only infrastructure images:

```bash
docker compose --env-file .env.production pull postgres-service redis-service minio-service minio-init-service
docker compose --env-file .env.production stop app-service worker-service
docker compose --env-file .env.production run --rm --no-deps --pull never migrate-service
docker compose --env-file .env.production up -d --pull never --remove-orphans
```

If migration fails, keep application traffic disabled until the failure is resolved. After the new application passes health checks, restore traffic. Users must sign in again. The previous release cannot run against the migrated database; reverting requires restoring the pre-upgrade database backup.
