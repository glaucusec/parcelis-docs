---
title: Deploy with the Single-Image Docker Build
slug: /deploy-with-docker-compose-single-image
---
Parcelis publishes an optional **single application image**, `parcelis/parcelis`, that bundles the web app, API, worker, and nginx edge routing into one application image. This is not a single-container deployment: PostgreSQL, Redis, and S3-compatible object storage (such as MinIO) remain separate services. The published `parcelis/apps`, `parcelis/worker`, and `parcelis/proxy` modular images continue to be published alongside it. This stack retains the bundled worker and runs its worker container from `parcelis/parcelis`; the dedicated `parcelis/worker` image is only required by the modular stack.

PostgreSQL, Redis, and S3-compatible object storage (such as MinIO) remain external services. Database migrations are still an explicit deployment step.

:::danger
**Existing PostgreSQL 16 installations**

The supplied Compose files now require PostgreSQL 18. **Before running `up` with the updated files, follow [Upgrade PostgreSQL 16 to 18](upgrade-postgresql.md).** Prisma migrations do not upgrade the database server. Existing volumes are preserved, and startup is blocked until the data migration is verified.
:::
## When to use the single-image artifact

Use `parcelis/parcelis` when you want:

- One application image and one exposed application port.
- A simpler self-hosted setup that is closer to a single deployable unit.
- The same public URL layout as the modular stack: web app at `/`, tRPC at `/trpc/*`, public API at `/api/*`, job dashboard at `/admin/jobs/`, legacy documentation links at `/docs/` redirecting to `https://docs.parcelis.dev/`.

Use the modular [Docker Compose stack](deploy-with-docker-compose.md#setting-up-parcelis) when you want to deploy or scale the proxy separately. Note that the web app and API run together inside the `parcelis/apps` image in the modular stack, so neither topology scales the web app independently from the API.

## Image name and tags

The deployment Compose file and Docker examples use `parcelis/parcelis:latest`. Release publishing also retains version tags. `PARCELIS_VERSION` is no longer used by the supplied Compose file; remove it from an existing environment file.

| Image               | Tag examples       |
| ------------------- | ------------------ |
| `parcelis/parcelis` | `latest` |

To use a local application build, build from the selected application checkout:

```bash
docker build --target single-image -f Dockerfile.app -t parcelis/parcelis:latest .
```

Skip `pull` when using this local image so it does not replace the build with a published image.

## Required environment variables

The single application image expects the same environment variables as the modular `parcelis/apps` service:

| Variable                                     | Purpose                                                                                                                                                          |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                               | PostgreSQL connection string                                                                                                                                     |
| `WEB_ORIGIN`                                 | Public origin used for CORS and the web app                                                                                                                      |
| `NEXTAUTH_URL`                               | Required public application URL; only the supplied Compose files default it to `WEB_ORIGIN`                                                                      |
| `NEXTAUTH_SECRET`                            | Required secret for encrypted authentication cookies                                                                                                             |
| `EMAIL_FROM`                                 | Sender address for password reset emails                                                                                                                         |
| `EMAIL_SETTINGS_ENCRYPTION_KEY`              | Base64-encoded 32-byte secret encrypting saved organization SMTP credentials. Keep it stable across restarts; changing it prevents decrypting existing passwords |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`      | SMTP server connection settings                                                                                                                                  |
| `SMTP_USER`, `SMTP_PASSWORD`                 | SMTP authentication credentials                                                                                                                                  |
| `S3_ENDPOINT`, `S3_PUBLIC_ENDPOINT`          | S3-compatible endpoint URLs                                                                                                                                      |
| `S3_BUCKET`                                  | Object storage bucket for uploaded images                                                                                                                        |
| `S3_REGION`                                  | Region for the object storage bucket                                                                                                                             |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`   | Object storage credentials                                                                                                                                       |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Redis connection used by the API and worker job queues                                                                                                           |

## Required working directory

The single application image container still expects the Prisma schema to run the migration job. When you run a migration container from the image, set its working directory to `/repo` (the compose example does this) so the bundled `prisma/schema.prisma` resolves correctly.

## Running with Docker

The example below starts the single-image container with an external PostgreSQL service, an external Redis service, and an external S3-compatible storage endpoint:

```bash
docker run -d --name parcelis-single-image \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://parcelis:parcelis@postgres:5432/parcelis?schema=public \
  -e WEB_ORIGIN=https://parcelis.example.com \
  -e NEXTAUTH_URL=https://parcelis.example.com \
  -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  -e EMAIL_FROM='Parcelis <no-reply@example.com>' \
  -e EMAIL_SETTINGS_ENCRYPTION_KEY=your-base64-32-byte-key \
  -e SMTP_HOST=smtp.example.com \
  -e SMTP_PORT=465 \
  -e SMTP_SECURE=true \
  -e SMTP_USER=your-smtp-user \
  -e SMTP_PASSWORD=your-smtp-password \
  -e S3_ENDPOINT=https://s3.example.com \
  -e S3_PUBLIC_ENDPOINT=https://s3.example.com \
  -e S3_BUCKET=parcelis-images \
  -e S3_REGION=us-east-1 \
  -e S3_ACCESS_KEY_ID=your-access-key \
  -e S3_SECRET_ACCESS_KEY=your-secret-key \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  -e REDIS_PASSWORD=your-redis-password \
  parcelis/parcelis:latest
```

Run the migration job as a separate step before starting the application container for the first time or after upgrading the image:

```bash
docker run --rm \
  -e DATABASE_URL=postgresql://parcelis:parcelis@postgres:5432/parcelis?schema=public \
  -w /repo \
  parcelis/parcelis:latest \
  pnpm --filter @parcelis/db exec prisma migrate deploy --schema prisma/schema.prisma
```

## Running with Docker Compose

Choose the exact release tag or full commit for your deployment. Download the single-image Compose file and environment template from that same revision:

```bash
PARCELIS_REF='<release-tag-or-full-commit>'
curl -fL "https://raw.githubusercontent.com/parcelis/parcelis/${PARCELIS_REF}/docker-compose-single-image.yml" -o docker-compose-single-image.yml
curl -fL "https://raw.githubusercontent.com/parcelis/parcelis/${PARCELIS_REF}/.env.production.example" -o .env.production.example
```

Replace the placeholder before running these commands. The application, migration, and worker services all use `parcelis/parcelis:latest`. The worker still runs in a separate container from that same image. For a local build, tag it `parcelis/parcelis:latest` and skip `pull` below. Use the same `PARCELIS_REF` for the [PostgreSQL migration helper](upgrade-postgresql.md#before-migrating-to-postgresql-18). Older releases require their matching deployment files.

For a new installation, configure the environment file and start the stack. Existing deployments must retain their saved `.env.production` and secrets.

```bash
cp .env.production.example .env.production
# edit .env.production with your production values

docker compose --env-file .env.production -f docker-compose-single-image.yml pull
docker compose --env-file .env.production -f docker-compose-single-image.yml up -d --remove-orphans
```

The single application image Compose stack will:

- Run the `migrate-service` job from the same `parcelis/parcelis` image before the application container starts.
- Run the `minio-init-service` job to create the object storage buckets and upload the public brand assets.
- Start `app-service` once both jobs have completed successfully and the database and object storage are ready.
- Start `worker-service` from the same `parcelis/parcelis` image to process background jobs once migrations are applied and Redis is healthy.

`app-service` exposes the web app at `/`, tRPC at `/trpc/*`, the public API at `/api/*`, and the job dashboard at `/admin/jobs/` on the configured `APP_PORT` (default `3000`). Legacy `/docs/` links redirect to `https://docs.parcelis.dev/`.

## Upgrading and running migrations

The NextAuth upgrade removes the database `Session` table. Previous application instances still query it, so use a maintenance window. Back up PostgreSQL, remove every application replica from your load balancer, and wait for in-flight requests to finish. Stop all old application and worker instances, including those on other hosts, before applying migrations. Keep PostgreSQL, Redis, and object storage running.

For Compose deployments:

```bash
docker compose --env-file .env.production \
  -f docker-compose-single-image.yml pull
docker compose --env-file .env.production \
  -f docker-compose-single-image.yml stop app-service worker-service
docker compose --env-file .env.production \
  -f docker-compose-single-image.yml run --rm --no-deps migrate-service
docker compose --env-file .env.production \
  -f docker-compose-single-image.yml up -d --remove-orphans
```

For standalone Docker deployments, pull the new image, drain traffic, and stop `parcelis-single-image` and every separate worker or application replica. Run the migration command from [Running with Docker](#running-with-docker), then recreate the application and worker containers from the new image with the saved environment settings.

If migration fails, keep application traffic disabled until the failure is resolved. Restore traffic only after the new application passes health checks. Users must sign in again. The previous release cannot run against the migrated database; reverting requires restoring the pre-upgrade database backup.

## Trade-offs compared with the modular Compose stack

| Concern                               | Single application image stack                                                              | Modular stack                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Number of running containers          | One application container plus a worker container plus the migrate and minio-init one-shots | Separate `app` and `worker` containers plus `proxy` plus the same one-shots |
| Image publishes                       | `parcelis/parcelis` only                                                                    | `parcelis/apps`, `parcelis/worker`, and `parcelis/proxy`               |
| Documentation site                    | Hosted independently at `https://docs.parcelis.dev/`                               | Hosted independently at `https://docs.parcelis.dev/`                         |
| Edge routing                          | nginx inside the `parcelis/parcelis` image                                                  | Standalone `parcelis/proxy` image                                                      |
| Independent scaling of proxy | Not supported (bundled into the application image)                                          | Supported                                                                              |
| Independent scaling of web vs API     | Not supported (both run together in either topology)                                        | Not supported (both run together in the `parcelis/apps` image)                          |
| PostgreSQL, Redis, and object storage | Separate services, identical to the modular stack                                           | Separate services, identical to the single-image stack                                 |
| Migration job                         | Uses the `parcelis/parcelis` image with `prisma migrate deploy`                             | Uses the `parcelis/apps` image with `prisma migrate deploy`                             |
| Background worker                     | `worker-service` from the same `parcelis/parcelis` image                                    | `worker-service` from the dedicated `parcelis/worker` image                                    |

Pick the single application image for a simpler deployment topology. Pick the modular stack when you need to deploy or scale the proxy separately from the application. Documentation is hosted independently in both topologies.
