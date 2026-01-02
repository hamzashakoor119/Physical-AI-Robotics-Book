import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

const BACKEND_URL = 'https://physical-ai-book-production-734f.up.railway.app';

// Animated Stats Component
function StatsSection() {
  const stats = [
    { number: '9', label: 'Chapters' },
    { number: '50+', label: 'Code Examples' },
    { number: '100+', label: 'Exercises' },
    { number: '24/7', label: 'AI Support' },
  ];

  return (
    <div className={styles.statsSection}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <span className={styles.statNumber}>{stat.number}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    { label: 'Start Learning', icon: '📚', link: '/docs/ch1-intro-physical-ai', primary: true },
    { label: 'Browse Chapters', icon: '📖', link: '/docs/ch1-intro-physical-ai', primary: false },
    { label: 'Read Blog', icon: '✍️', link: '/blog', primary: false },
    { label: 'View on GitHub', icon: '⭐', link: 'https://github.com/hamzashakoor119/Physical-AI-Robotics-Book', primary: false },
  ];

  return (
    <div className={styles.quickActions}>
      <div className={styles.actionsGrid}>
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={clsx(styles.actionCard, action.primary && styles.actionPrimary)}
            target={action.link.startsWith('http') ? '_blank' : undefined}
            rel={action.link.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionLabel}>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Chapter Preview Component
function ChapterPreview() {
  const chapters = [
    { number: '01', title: 'Introduction to Physical AI', desc: 'Fundamentals of embodied intelligence', link: '/docs/ch1-intro-physical-ai' },
    { number: '02', title: 'Sensors & Perception', desc: 'How robots sense the world', link: '/docs/ch2-sensors-physical-ai' },
    { number: '03', title: 'Actuators & Movement', desc: 'Motors, servos, and control systems', link: '/docs/ch3-actuators-physical-ai' },
    { number: '04', title: 'Control Systems', desc: 'PID, feedback, and stability', link: '/docs/ch4-control-systems' },
  ];

  return (
    <section className={styles.chapterPreview}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What's Inside</h2>
          <p className={styles.sectionSubtitle}>A complete journey from basics to advanced robotics</p>
        </div>
        <div className={styles.chaptersGrid}>
          {chapters.map((chapter, index) => (
            <Link key={index} to={chapter.link} className={styles.chapterCard}>
              <span className={styles.chapterNumber}>{chapter.number}</span>
              <h3 className={styles.chapterTitle}>{chapter.title}</h3>
              <p className={styles.chapterDesc}>{chapter.desc}</p>
              <span className={styles.chapterArrow}>→</span>
            </Link>
          ))}
        </div>
        <div className={styles.viewAllContainer}>
          <Link to="/docs/ch1-intro-physical-ai" className={styles.viewAllLink}>
            View All Chapters →
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroBackground}>
        <div className={styles.heroOrb} />
        <div className={styles.heroOrb2} />
        <div className={styles.heroGrid} />
      </div>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>🚀 Physical AI & Humanoid Robotics</div>
        <h1 className={styles.heroTitle}>
          {siteConfig.title}
        </h1>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <p className={styles.heroDescription}>
          Master the fundamentals of Physical AI and build intelligent embodied systems
          through hands-on projects, Python code examples, and real-world robotics applications.
        </p>
        <QuickActions />
      </div>
      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  const [health, setHealth] = useState<{status?: string} | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Backend health:', data);
        setHealth(data);
        setHealthError(null);
      })
      .catch((err) => {
        console.error('Backend error:', err);
        setHealth(null);
        setHealthError(String(err?.message || err));
      });
  }, []);

  return (
    <Layout
      title={`${siteConfig.title} - Physical AI & Humanoid Robotics`}
      description="A comprehensive textbook for building intelligent embodied systems. Learn Physical AI, robotics, ROS2, NVIDIA Isaac, and VLA models."
    >
      <HomepageHeader />
      <StatsSection />
      <main>
        <HomepageFeatures
          backendUrl={BACKEND_URL}
          backendHealth={health}
          backendError={healthError}
        />
        <ChapterPreview />
      </main>
    </Layout>
  );
}
