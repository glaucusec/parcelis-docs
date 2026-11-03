import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

const baseUrl = '/';

const config: Config = {
  title: 'Parcelis Docs',
  tagline: 'Documentation for Parcelis',
  favicon: 'img/favicon.svg',
  future: {v4: true},
  url: 'https://docs.parcelis.dev',
  baseUrl,
  organizationName: 'parcelis',
  projectName: 'parcelis-docs',
  onBrokenLinks: 'throw',
  i18n: {defaultLocale: 'en', locales: ['en']},
  markdown: {
    mermaid: true,
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },
  themes: ['@docusaurus/theme-mermaid', 'docusaurus-theme-openapi-docs'],
  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          parcelis: {
            specPath: 'static/openapi/parcelis.openapi.json',
            outputDir: 'docs/api',
            downloadUrl: `${baseUrl}openapi/parcelis.openapi.json`,
            sidebarOptions: {groupPathsBy: 'tag', categoryLinkSource: 'auto'},
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          docItemComponent: '@theme/ApiItem',
          editUrl: 'https://github.com/parcelis/parcelis-docs/tree/docusaurus-docs-site/docusaurus-site/',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    api: {
      schemaExpansion: {default: 1},
    },
    colorMode: {respectPrefersColorScheme: true},
    navbar: {
      title: 'Parcelis Docs',
      logo: {
        alt: 'Parcelis',
        src: 'img/parcelis-light.png',
        srcDark: 'img/parcelis-dark.png',
        width: 48,
        height: 48,
      },
      items: [
        {type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs', className: 'header-social-link header-docs-link'},
        {to: '/docs/category/api-reference', label: 'API Reference', position: 'left', className: 'header-social-link header-api-link'},
        {href: 'https://github.com/parcelis/parcelis', label: 'GitHub', className: 'header-social-link header-github-link', position: 'right'},
        {href: 'https://discord.com/invite/fQACQU8qdz', label: 'Discord', className: 'header-social-link header-discord-link', position: 'right'},
        {href: 'https://parcelis.dev', label: 'Parcelis', className: 'header-social-link header-parcelis-link', position: 'right'},
      ],
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  } satisfies Preset.ThemeConfig,
};

export default config;
