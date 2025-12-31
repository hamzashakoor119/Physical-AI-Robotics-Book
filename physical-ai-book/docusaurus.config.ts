import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'An AI-Native Textbook for Physical AI and Humanoid Robotics',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://hamzashakoor119.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/GIAIC-Q4-Hackathone/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'hamzashakoor119', // Usually your GitHub org/user name.
  projectName: 'GIAIC-Q4-Hackathone', // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Configure MDX to be less strict with special characters
  markdown: {
    format: 'detect',
    mermaid: false,
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Disable MDX for markdown files to avoid JSX parsing issues
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
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
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Physical AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Textbook',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/hamzashakoor119/GIAIC-Q4-Hackathone',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Physical AI & Humanoid Robotics',
        src: 'img/physical-ai-logo.png',
        // Note: Ensure /static/img/physical-ai-logo.png exists. Site will still build if missing.
      },
      links: [
        {
          title: 'Textbook',
          items: [
            {
              label: 'Course Overview',
              to: '/docs/ch1-intro-physical-ai',
            },
            {
              label: 'Chapter List',
              to: '/docs/ch1-intro-physical-ai',
            },
            // TODO: Add hardware requirements page link when created
            // {
            //   label: 'Hardware Requirements',
            //   to: '/docs/hardware-requirements',
            // },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/hamzashakoor119',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/@codewithhamza119',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/hamza-shakoor-6a4350180?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            },
            {
              label: 'X (Twitter)',
              href: 'https://x.com/hamzashakoor019?t=hWGOtgYhiC42ehr_6hcnzg&s=09',
            },
            {
              label: 'Instagram',
              href: 'https://www.instagram.com/hamzashakoor119/?__pwa=1',
            },
          ],
        },
        {
          title: 'Project & Code',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/hamzashakoor119/GIAIC-Q4-Hackathone',
            },
            // TODO: Add hackathon details page link when created
            // {
            //   label: 'Hackathon Details',
            //   to: '/docs/hackathon-details',
            // },
            {
              label: 'Contribute',
              href: 'https://github.com/hamzashakoor119/GIAIC-Q4-Hackathone/issues',
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'Email: hamzashakoor119@gmail.com',
              href: 'mailto:hamzashakoor119@gmail.com',
            },
            {
              label: 'Phone: +92 305 2334794',
              href: '#', // Using # to avoid tel: link issues
            },
            // Note: Contact form coming soon
          ],
        },
      ],
      copyright: `© 2025 CodeWithHamza — All Rights Reserved<br/>Created with Docusaurus • Powered by ROS 2, Gazebo, Unity, and NVIDIA Isaac`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
