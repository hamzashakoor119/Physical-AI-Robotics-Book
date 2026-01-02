import React, { useState } from 'react';
import styles from './styles.module.css';
import { getBackendApiPath } from '../../utils/backendUrl';

interface TranslateButtonProps {
  chapterContent?: string;
  chapterId?: string;
  apiEndpoint?: string;
}

export default function TranslateButton({
  chapterContent,
  chapterId,
  apiEndpoint
}: TranslateButtonProps): React.ReactElement {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [language, setLanguage] = useState<'ur' | 'en'>('ur');

  const handleTranslate = async () => {
    setIsTranslating(true);
    const baseUrl = apiEndpoint || getBackendApiPath();

    try {
      // Get current page content if not provided
      const content = chapterContent || document.querySelector('article')?.innerText || '';

      const response = await fetch(`${baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content.substring(0, 5000), // Limit content size for translation
          target_language: language,
          chapter_id: chapterId || window.location.pathname
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to translate: ${response.status}`);
      }

      const data = await response.json();
      setTranslatedContent(data.translated_text || data.translation);
      setShowModal(true);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate content. Make sure backend is running.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <>
      <div className={styles.translateContainer}>
        <button
          className={styles.translateButton}
          onClick={handleTranslate}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <>
              <span className={styles.spinner}></span>
              Translating...
            </>
          ) : (
            <>
              <span className={styles.icon}>🌐</span>
              Translate to Urdu
            </>
          )}
        </button>

        <div className={styles.languageInfo}>
          <span className={styles.badge}>اردو</span>
          <span className={styles.description}>
            Get this chapter in Urdu while preserving technical terms
          </span>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>اردو ترجمہ (Urdu Translation)</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.translationBadge}>
                <strong>Language:</strong> Urdu (اردو) | <strong>Chapter:</strong> {chapterId || 'Current'}
              </div>
              <div className={styles.contentPreview}>
                {translatedContent}
              </div>
              <div className={styles.technicalNote}>
                <strong>Note:</strong> Technical terms (ROS 2, URDF, etc.) are preserved in English for accuracy.
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                بند کریں (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
