import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics Book By CodeWithHamza',
  tagline: 'A Comprehensive Textbook for Building Intelligent Embodied Systems',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://physical-ai-robotics-book-sepia.vercel.app',
  baseUrl: '/',

  organizationName: 'hamzashakoor119',
  projectName: 'Physical-AI-Humanoid-Robotics-Book-By-CodeWithHamza',

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Custom fields for runtime configuration
  // Set BACKEND_URL environment variable during build for production
  customFields: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8000/api',
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
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/hamzashakoor119/Physical-AI-Robotics-Book/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/hamzashakoor119/Physical-AI-Robotics-Book/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CodeWithHamza',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Chapters',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/hamzashakoor119/Physical-AI-Robotics-Book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Content',
          items: [
            {
              label: 'Introduction to Physical AI',
              to: '/docs/ch1-intro-physical-ai',
            },
            {
              label: 'Sensors',
              to: '/docs/ch2-sensors-physical-ai',
            },
            {
              label: 'Actuators',
              to: '/docs/ch3-actuators-physical-ai',
            },
          ],
        },
        {
          title: 'Advanced Topics',
          items: [
            {
              label: 'ROS2 Fundamentals',
              to: '/docs/ch5-ros2-fundamentals',
            },
            {
              label: 'NVIDIA Isaac',
              to: '/docs/ch7-nvidia-isaac',
            },
            {
              label: 'VLA Robotics',
              to: '/docs/ch8-vla-robotics',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/hamzashakoor119/Physical-AI-Robotics-Book',
            },
            {
              label: 'GIAIC',
              href: 'https://www.piaic.org/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI Book by CodeWithHamza. Built for GIAIC Hackathon.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml', 'json'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
