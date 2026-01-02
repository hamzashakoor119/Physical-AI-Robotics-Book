import React, { useState } from 'react';
import styles from './styles.module.css';
import { getBackendApiPath } from '../../utils/backendUrl';

interface PersonalizeButtonProps {
  chapterContent?: string;
  chapterId?: string;
  apiEndpoint?: string;
}

export default function PersonalizeButton({
  chapterContent,
  chapterId,
  apiEndpoint
}: PersonalizeButtonProps): React.ReactElement {
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState({
    expertise_level: 'intermediate',
    hardware_access: 'simulation_only',
    robotics_experience: 'beginner'
  });

  const handlePersonalize = async () => {
    setIsPersonalizing(true);
    const baseUrl = apiEndpoint || getBackendApiPath();

    try {
      // Get current page content if not provided
      const content = chapterContent || document.querySelector('article')?.innerText || '';

      const response = await fetch(`${baseUrl}/personalization/personalize-chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for auth
        body: JSON.stringify({
          chapter_id: chapterId || window.location.pathname,
          content: content.substring(0, 5000), // Limit content size
          user_profile: userProfile
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to personalize: ${response.status}`);
      }

      const data = await response.json();
      setPersonalizedContent(data.personalized_content || data.content);
      setShowModal(true);
    } catch (error) {
      console.error('Personalization error:', error);
      alert('Failed to personalize content. Make sure backend is running.');
    } finally {
      setIsPersonalizing(false);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className={styles.personalizeContainer}>
        <button
          className={styles.personalizeButton}
          onClick={handlePersonalize}
          disabled={isPersonalizing}
        >
          {isPersonalizing ? (
            <>
              <span className={styles.spinner}></span>
              Personalizing...
            </>
          ) : (
            <>
              <span className={styles.icon}>👤</span>
              Personalize Chapter
            </>
          )}
        </button>

        <div className={styles.profileSelector}>
          <label>
            Expertise:
            <select
              value={userProfile.expertise_level}
              onChange={(e) => handleProfileChange('expertise_level', e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>

          <label>
            Hardware:
            <select
              value={userProfile.hardware_access}
              onChange={(e) => handleProfileChange('hardware_access', e.target.value)}
            >
              <option value="none">No Hardware</option>
              <option value="simulation_only">Simulation Only</option>
              <option value="basic_kit">Basic Kit</option>
              <option value="full_lab">Full Lab</option>
            </select>
          </label>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Personalized Content</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.profileBadge}>
                <strong>Tailored for:</strong> {userProfile.expertise_level} | {userProfile.hardware_access}
              </div>
              <div className={styles.contentPreview}>
                {personalizedContent}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
