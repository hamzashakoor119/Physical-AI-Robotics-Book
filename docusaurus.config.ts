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

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      }),
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CodeWithHamza',
      logo: {
        alt: 'Physical AI Logo',
        src: 'img/favicon.ico',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '📖 Chapters',
        },
        {
          to: '/blog',
          label: '✍️ Blog',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/hamzashakoor119/Physical-AI-Robotics-Book',
          label: '⭐ GitHub',
          position: 'right',
        },
      ],
      hideOnScroll: false,
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '📚 Learning Path',
          items: [
            {
              label: 'Chapter 1: Introduction',
              to: '/docs/ch1-intro-physical-ai',
            },
            {
              label: 'Chapter 2: Sensors',
              to: '/docs/ch2-sensors-physical-ai',
            },
            {
              label: 'Chapter 3: Actuators',
              to: '/docs/ch3-actuators-physical-ai',
            },
            {
              label: 'Chapter 4: Control Systems',
              to: '/docs/ch4-control-systems',
            },
          ],
        },
        {
          title: '🚀 Advanced Topics',
          items: [
            {
              label: 'ROS2 Fundamentals',
              to: '/docs/ch5-ros2-fundamentals',
            },
            {
              label: 'Digital Twin & Simulation',
              to: '/docs/ch6-digital-twin-simulation',
            },
            {
              label: 'NVIDIA Isaac Sim',
              to: '/docs/ch7-nvidia-isaac',
            },
            {
              label: 'VLA Robotics',
              to: '/docs/ch8-vla-robotics',
            },
          ],
        },
        {
          title: '💻 Resources',
          items: [
            {
              label: 'Python Code Examples',
              to: '/docs/ch1-intro-physical-ai',
            },
            {
              label: 'Exercise Questions',
              to: '/docs/ch1-intro-physical-ai',
            },
            {
              label: 'AI Assistant',
              to: '/docs/ch1-intro-physical-ai',
            },
          ],
        },
        {
          title: '🌐 Community',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/hamzashakoor119/Physical-AI-Robotics-Book',
            },
            {
              label: 'GIAIC Official',
              href: 'https://www.piaic.org/',
            },
            {
              label: 'Report Issues',
              href: 'https://github.com/hamzashakoor119/Physical-AI-Robotics-Book/issues',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI Book by CodeWithHamza. Built with ❤️ for the robotics community.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml', 'json', 'markdown'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
