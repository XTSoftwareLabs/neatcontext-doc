import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NeatContext',
  tagline: 'Official documentation',
  favicon: 'img/logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // --- Deployment target ---------------------------------------------------
  // Served on the custom domain docs.neatcontext.com (see static/CNAME). A custom
  // domain serves at the host root, so baseUrl is '/'. To revert to the GitHub
  // Pages project URL, set url back to 'https://xtsoftwarelabs.github.io' and
  // baseUrl to '/neatcontext-doc/', and remove static/CNAME.
  url: 'https://docs.neatcontext.com',
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'XTSoftwareLabs', // GitHub org that owns the repo.
  projectName: 'neatcontext-doc', // Repo name.

  onBrokenLinks: 'throw',

  // Manrope — the neatcontext.com brand typeface.
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
      type: 'text/css',
    },
  ],

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          // Docs-only mode: serve the docs at the site root ("/") instead of
          // "/docs". There is no separate marketing homepage.
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // "Edit this page" links point at this documentation repo.
          editUrl:
            'https://github.com/XTSoftwareLabs/neatcontext-doc/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Offline/local search — no external Algolia dependency.
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      // Always render the light ("normal") theme. Do not follow the device's
      // system setting — a phone/OS defaulting to dark otherwise forced the
      // docs into dark mode, where text rendered poorly. disableSwitch hides
      // the toggle so no one can land in that broken dark theme.
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'NeatContext',
      logo: {
        alt: 'NeatContext',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://github.com/XTSoftwareLabs/neatcontext-doc',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/',
            },
            {
              label: 'Getting Started',
              to: '/getting-started',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/XTSoftwareLabs/neatcontext-doc',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} XTSoftware Labs. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
