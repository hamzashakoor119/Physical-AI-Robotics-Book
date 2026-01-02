import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  icon: ReactNode;
  link?: string;
};

type HomepageFeaturesProps = {
  backendUrl?: string;
  backendHealth?: {status?: string} | null;
  backendError?: string | null;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Comprehensive Curriculum',
    description: (
      <>
        9 complete chapters covering Physical AI from fundamentals to advanced
        topics including ROS2, NVIDIA Isaac, and Vision-Language-Action models.
      </>
    ),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: 'AI-Powered Assistant',
    description: (
      <>
        Interactive RAG chatbot to help you learn. Select text and ask questions,
        get personalized explanations, and translate content to Urdu.
      </>
    ),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <circle cx="8" cy="14" r="1" />
        <circle cx="12" cy="14" r="1" />
        <circle cx="16" cy="14" r="1" />
      </svg>
    ),
  },
  {
    title: 'Hands-On Learning',
    description: (
      <>
        Each chapter includes Python code examples, exercises, review questions,
        and real-world robotics applications you can implement.
      </>
    ),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

function Feature({title, description, icon, link}: FeatureItem) {
  const content = (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{description}</p>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className={styles.featureLink}>
        {content}
      </Link>
    );
  }

  return content;
}

function BackendStatusPill({
  backendUrl,
  backendHealth,
  backendError,
}: HomepageFeaturesProps) {
  const connected = backendHealth?.status === 'OK';

  return (
    <div className={styles.backendStatus}>
      <div className={styles.statusPill}>
        <span className={styles.statusDot} />
        <span className={styles.statusText}>
          {connected ? 'AI Assistant Online' : backendError ? 'AI Assistant Offline' : 'Connecting...'}
        </span>
        {connected && <span className={styles.statusPulse} />}
      </div>
    </div>
  );
}

export default function HomepageFeatures({
  backendUrl,
  backendHealth,
  backendError,
}: HomepageFeaturesProps): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why This Book?</h2>
          <p className={styles.sectionSubtitle}>Everything you need to master Physical AI and robotics</p>
        </div>

        <BackendStatusPill
          backendUrl={backendUrl}
          backendHealth={backendHealth}
          backendError={backendError}
        />

        <div className={styles.featuresGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
