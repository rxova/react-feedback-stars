import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { themes as prismThemes } from 'prism-react-renderer'

/** TypeDoc regenerates the API pages from the package source on every build, so
 *  the reference can never drift from the code. A dedicated tsconfig keeps the
 *  library's test/build-only global types out of the generated program. */
const typedocOptions = {
  id: 'api',
  entryPoints: ['../../packages/react-feedback-stars/src/index.ts'],
  tsconfig: '../../packages/react-feedback-stars/tsconfig.typedoc.json',
  out: 'docs/api',
  readme: 'none',
  indexFormat: 'table',
  parametersFormat: 'table',
  interfacePropertiesFormat: 'table',
  enumMembersFormat: 'table',
  useCodeBlocks: true,
  disableSources: true,
  hidePageHeader: true,
  hideBreadcrumbs: true,
  cleanOutputDir: true,
}

const config: Config = {
  title: 'react-feedback-stars',
  tagline:
    'Any icon, any precision, accessible. A headless, zero-dependency React rating component.',
  favicon: 'img/favicon.svg',

  url: 'https://rxova.github.io',
  baseUrl: '/react-feedback-stars/',
  organizationName: 'rxova',
  projectName: 'react-feedback-stars',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  markdown: { hooks: { onBrokenMarkdownLinks: 'warn' } },

  i18n: { defaultLocale: 'en', locales: ['en'] },

  plugins: [['docusaurus-plugin-typedoc', typedocOptions]],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/rxova/react-feedback-stars/tree/main/apps/docs/',
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'react-feedback-stars',
      items: [
        { type: 'doc', docId: 'learn/getting-started', position: 'left', label: 'Docs' },
        { to: '/api', position: 'left', label: 'API' },
        {
          href: 'https://www.npmjs.com/package/react-feedback-stars',
          position: 'right',
          label: 'npm',
        },
        {
          href: 'https://github.com/rxova/react-feedback-stars',
          position: 'right',
          label: 'GitHub',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright:
        'MIT-licensed. Built with Docusaurus. API reference generated from source with TypeDoc.',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
