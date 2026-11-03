# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
pnpm install --frozen-lockfile
```

Use Node.js 22.13 or newer (Node.js 24 LTS recommended) and pnpm 12.16.1, pinned in `package.json`. The committed `pnpm-lock.yaml` is the dependency source of truth.

## Local Development

```bash
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The site is configured for `https://docs.parcelis.dev` with `baseUrl: '/'`.

In Cloudflare Pages, connect `parcelis/parcelis-docs` and use:

| Setting | Value |
| --- | --- |
| Production branch | `docusaurus-docs-site` |
| Root directory | `docusaurus-site` |
| Build command | `pnpm build` |
| Build output directory | `build` |
| Environment variable `NODE_VERSION` | `24` |
| Environment variable `PNPM_VERSION` | `12.16.1` |

Add `docs.parcelis.dev` under the Pages project's custom domains and complete
the DNS setup shown by Cloudflare. Connecting the repository and configuring the
custom domain are separate deployment steps; the source configuration does not
publish the site.

Cloudflare builds the committed API pages. After changing the OpenAPI specification
or site base path, run `pnpm generate:api` and commit its output before deploying.

Local development is served at `http://localhost:3000/`.

## Dependency checks

```bash
pnpm outdated
pnpm audit
pnpm typecheck
pnpm build
```

Docusaurus packages must stay on the same stable version. Security overrides in
`pnpm-workspace.yaml` update `serialize-javascript` and `tinypool` to patched
releases, and keep SockJS on the patched CommonJS-compatible UUID 11 line.
Review these overrides when upgrading Docusaurus. SWC's native setup script is
allowed; the optional core-js postinstall message is disabled.

As of October 28, 2026, `deepmerge@4.3.1` has one low-severity advisory
([GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4))
and no published patched release. It is used by the SVG build tooling through
`@svgr/plugin-svgo`. Recheck the advisory when updating dependencies.

## Documentation content

`docs/` contains a copy of the 53 documents from the repository's `v1.0` branch,
imported on October 28, 2026. The original repository-root `docs/` is unchanged.
Edit the Docusaurus copy here independently.

`sidebars.ts` preserves the source section and page order. ReadMe callouts use
Docusaurus admonitions, internal links use Markdown file paths, and Mermaid
diagrams use the standard Docusaurus Mermaid theme. No source styling was imported;
the site uses the classic theme with Parcelis palette variables. Empty section pages show default
document cards. The home page opens the Platform User Guide.

The API reference is generated from `static/openapi/parcelis.openapi.json`, copied
from the `v1.0` branch's `reference/parcelis.openapi.json`. Its 26 endpoint pages
and API overview live in `docs/api/`, grouped by the original resource tags under
**API Reference**. The API authentication guide links to this local reference.
The source repository's `reference/` directory is unchanged.

To update endpoints, replace the copied specification, then run:

```bash
pnpm generate:api
pnpm build
```

Generated files in `docs/api/` are replaced by `generate:api`; edit the specification
rather than generated MDX. The reference uses the Docusaurus OpenAPI plugin and
theme, keeping the Parcelis palette. The OpenAPI export respects the site base URL.
API requests use the server URL specified in the OpenAPI document.

The OpenAPI theme's Postman dependency pins legacy `@faker-js/faker@5.5.3`.
`pnpm audit` reports [GHSA-qxc2-j82w-r537](https://github.com/advisories/GHSA-qxc2-j82w-r537)
(high) for that package. Faker 10.5+ changes the API and package exports used by
Postman, so a forced major override is incompatible. Recheck upstream Postman/theme
releases for a compatible fix. YAML and UUID dependencies use patched overrides.
The optional Parcel watcher build and Postman nested installer are disabled; the
plugin's generation and production build work with the packaged dependencies.

## Colors

Edit `src/css/custom.css` to change the Parcelis palette. Light mode uses off-white
pages, white surfaces, navy text, and green accents. Dark mode uses navy surfaces
with light green links. Text colors use darker or lighter palette shades for contrast.
