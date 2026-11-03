import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import rosterPlugin from './plugins/roster';

const config: Config = {
  title: 'Town Of Us: Mira Docs',
  tagline: 'A comprehensive guide to Town Of Us: Mira',
  favicon: 'img/logo.ico',
  url: 'https://au-avengers.github.io',
  baseUrl: '/docs.toum.gg/',
  // url: 'https://docstoum.com',
  // baseUrl: 'docstoum.com',
  organizationName: 'AU-Avengers',
  projectName: 'docs.toum.gg',
  deploymentBranch: 'gh-pages',
  onBrokenLinks: 'warn',
  staticDirectories: ['static'],
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  future: {
    faster: true,
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      // FIXME with this option turned on, all links become red
      useCssCascadeLayers: false,
      siteStorageNamespacing: true,
      fasterByDefault: true,
      mdx1CompatDisabledByDefault: true,
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/AU-Avengers/docs.toum.gg/blob/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/AU-Avengers/docs.toum.gg/blob/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: [
            require.resolve('@fontsource/lilita-one/400.css'),
            require.resolve('@fontsource-variable/nunito/wght.css'),
            require.resolve('@fontsource-variable/nunito/wght-italic.css'),
            require.resolve('@fontsource-variable/jetbrains-mono/wght.css'),
            './src/css/custom.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [rosterPlugin],
  clientModules: ['./src/clientModules/lightsReveal.ts', './src/clientModules/docPage.ts'],

  themeConfig: {
    image: 'img/Embed.png',
    navbar: {
      title: 'Town Of Us: Mira',
      logo: {
        alt: 'Town Of Us: Mira Logo',
        src: '/img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'rolesSidebar',
          position: 'left',
          label: 'Roles',
        },
        {
          type: 'docSidebar',
          sidebarId: 'modifiersSidebar',
          position: 'left',
          label: 'Modifiers',
        },
        {
        type: 'docSidebar',
        sidebarId: 'settingsSidebar',
        position: 'left',
        label: 'Settings'
        },
        {
          type: 'docSidebar',
          sidebarId: 'installSidebar',
          position: 'left',
          label: 'Installation',
        },
        {
          to: '/blog',
          label: 'Changelog',
          position: 'left',
        },
        {
          href: 'https://discord.gg/ugyc4EVUYZ',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://github.com/AU-Avengers/TOU-Mira',
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
              label: 'Roles',
              to: '/docs/category/crewmates',
            },
             {
               label: 'Modifiers',
               to: '/docs/category/alliances',
             },
              {
              label: 'Settings',
              to: '/docs/category/settings',
             },
            {
               label: 'Installation',
               to: '/docs/install/intro',
             },
            {
              label: 'Changelog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/ugyc4EVUYZ',
            },
            {
              label: 'GitHub Organization',
              href: 'https://github.com/AU-Avengers',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AU Avengers. All rights reserved.<br/>Site design by <a href="https://github.com/artriy" target="_blank" rel="noopener noreferrer">artriy</a>`,
    },
    colorMode: {
      defaultMode: 'dark'
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['csharp', 'ini']
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
