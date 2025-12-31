import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Physical AI & Humanoid Robotics',
      collapsible: false,
      items: [
        'ch1-intro-physical-ai',
        'ch2-sensors-physical-ai',
        'ch3-actuators-physical-ai',
        'ch4-control-systems',
        'ch5-ros2-fundamentals',
        'ch6-digital-twin-simulation',
      ],
    },
  ],
};

export default sidebars;
