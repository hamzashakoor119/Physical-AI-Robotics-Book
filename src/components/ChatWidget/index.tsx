import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface UserBackground {
  software_experience?: string;
  hardware_experience?: string;
  robotics_knowledge?: string;
  preferred_language?: string;
}

interface ChatWidgetProps {
  apiEndpoint?: string;
}

interface SelectionPopup {
  visible: boolean;
  x: number;
  y: number;
  text: string;
}

export default function ChatWidget({ apiEndpoint }: ChatWidgetProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'ur'>('en');
  const [strictMode, setStrictMode] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [useStreaming, setUseStreaming] = useState(true);
  const [messageQueue, setMessageQueue] = useState<string[]>([]); // Message queue for non-blocking input
  const [selectionPopup, setSelectionPopup] = useState<SelectionPopup>({ visible: false, x: 0, y: 0, text: '' });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for auto-focus
  const abortControllerRef = useRef<AbortController | null>(null);

  const [userBackground, setUserBackground] = useState<UserBackground>({
    software_experience: 'beginner',
    hardware_experience: 'beginner',
    robotics_knowledge: 'basic',
    preferred_language: 'en'
  });

  useEffect(() => {
    setUserBackground(prev => ({
      ...prev,
      preferred_language: preferredLanguage
    }));
  }, [preferredLanguage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Feature 2: Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Feature 1: Listen for text selection and show floating "Ask AI" popup
  useEffect(() => {
    const handleSelection = (e: MouseEvent) => {
      const selection = window.getSelection();
      const selectedString = selection?.toString().trim() || '';

      if (selectedString.length > 0) {
        // Get selection coordinates
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setSelectionPopup({
            visible: true,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            text: selectedString
          });
        }
        setSelectedText(selectedString);
      } else {
        // Hide popup when clicking elsewhere (not on the popup itself)
        const target = e.target as HTMLElement;
        if (!target.closest(`.${styles.askAiPopup}`)) {
          setSelectionPopup({ visible: false, x: 0, y: 0, text: '' });
        }
      }
    };

    const handleScroll = () => {
      // Hide popup on scroll
      setSelectionPopup({ visible: false, x: 0, y: 0, text: '' });
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // Feature 3: Process message queue when not busy
  useEffect(() => {
    const processQueue = async () => {
      if (messageQueue.length > 0 && !isLoading && !isStreaming) {
        const nextMessage = messageQueue[0];
        setMessageQueue(prev => prev.slice(1));
        await sendMessage(nextMessage, false);
      }
    };
    processQueue();
  }, [messageQueue, isLoading, isStreaming]);

  // Streaming chat using SSE
  const sendStreamingMessage = async (query: string) => {
    const baseUrl = apiEndpoint || `${process.env.BACKEND_URL}/api`;

    // Cancel any ongoing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${baseUrl}/rag/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          session_id: sessionId,
          user_background: userBackground,
          top_k: 3
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let assistantMessage = '';
      let messageIndex = -1;

      // Add empty assistant message that will be updated
      setMessages(prev => {
        messageIndex = prev.length;
        return [...prev, { role: 'assistant', content: '', isStreaming: true }];
      });

      setIsStreaming(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'session') {
                setSessionId(data.session_id);
              } else if (data.type === 'token') {
                assistantMessage += data.content;
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated[messageIndex]) {
                    updated[messageIndex] = {
                      role: 'assistant',
                      content: assistantMessage,
                      isStreaming: true
                    };
                  }
                  return updated;
                });
              } else if (data.type === 'content') {
                // Full content (for greetings, etc.)
                assistantMessage = data.content;
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated[messageIndex]) {
                    updated[messageIndex] = {
                      role: 'assistant',
                      content: assistantMessage,
                      isStreaming: false
                    };
                  }
                  return updated;
                });
              } else if (data.type === 'done') {
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated[messageIndex]) {
                    updated[messageIndex] = {
                      ...updated[messageIndex],
                      isStreaming: false
                    };
                  }
                  return updated;
                });
              } else if (data.type === 'error') {
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated[messageIndex]) {
                    updated[messageIndex] = {
                      role: 'assistant',
                      content: `Error: ${data.message}`,
                      isStreaming: false
                    };
                  }
                  return updated;
                });
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return; // User cancelled
      }
      console.error('Streaming error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Connection failed'}. Falling back to non-streaming mode.`,
        isStreaming: false
      }]);
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Legacy non-streaming chat
  const sendNonStreamingMessage = async (query: string, isSelectionQuery: boolean = false) => {
    const baseUrl = apiEndpoint || `${process.env.BACKEND_URL}/api`;

    try {
      let response;

      if (isSelectionQuery && selectedText) {
        if (strictMode) {
          response = await fetch(`${baseUrl}/rag/answer-from-selection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              selected_text: selectedText,
              question: query,
              user_background: userBackground
            }),
          });
        } else {
          response = await fetch(`${baseUrl}/rag/selection-query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              selected_text: selectedText,
              question: query,
              user_background: userBackground,
              top_k: 3
            }),
          });
        }
      } else {
        // Use new smart chat endpoint
        response = await fetch(`${baseUrl}/rag/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            session_id: sessionId,
            user_background: userBackground,
            top_k: 3
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update session ID if returned
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      return data.message || data.answer || 'No response received';
    } catch (error) {
      console.error('Error calling backend API:', error);
      return `I'm having trouble connecting to the backend. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const sendMessage = async (query: string, isSelectionQuery: boolean = false) => {
    if (!query.trim()) return;

    // Feature 3: If busy, add to queue instead of blocking
    if (isLoading || isStreaming) {
      setMessageQueue(prev => [...prev, query]);
      setInput('');
      return;
    }

    setIsLoading(true);

    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Use streaming for non-selection queries when enabled
      if (useStreaming && !isSelectionQuery) {
        await sendStreamingMessage(query);
      } else {
        const response = await sendNonStreamingMessage(query, isSelectionQuery);
        const assistantMessage: Message = { role: 'assistant', content: response };
        setMessages(prev => [...prev, assistantMessage]);
      }

      setSelectedText('');
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Feature 1: Handle "Ask AI" button click from floating popup
  const handleAskAI = () => {
    const textToAsk = selectionPopup.text;
    if (!textToAsk) return;

    // Open chat if closed
    if (!isOpen) {
      setIsOpen(true);
    }

    // Set the selected text and send to chat
    setSelectedText(textToAsk);
    const prompt = `Explain this: "${textToAsk.slice(0, 200)}${textToAsk.length > 200 ? '...' : ''}"`;

    // Hide popup
    setSelectionPopup({ visible: false, x: 0, y: 0, text: '' });

    // Send message (will be queued if busy)
    setTimeout(() => {
      sendMessage(prompt, true);
    }, 150);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input, selectedText.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input, selectedText.length > 0);
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  return (
    <>
      {/* Feature 1: Floating "Ask AI" Popup on Text Selection */}
      {selectionPopup.visible && (
        <div
          className={styles.askAiPopup}
          style={{
            position: 'fixed',
            left: `${selectionPopup.x}px`,
            top: `${selectionPopup.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 1001,
          }}
        >
          <button onClick={handleAskAI} className={styles.askAiButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Ask AI
          </button>
        </div>
      )}

      {/* Chat Toggle Button */}
      <motion.button
        className={styles.chatToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isOpen ? 90 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className={styles.chatHeader}>
            <h3>Physical AI Assistant</h3>
            <span className={styles.subtitle}>Ask questions about the textbook</span>
            <div className={styles.headerControls}>
              <div className={styles.languageToggle}>
                <button
                  className={`${styles.langButton} ${preferredLanguage === 'en' ? styles.activeLang : ''}`}
                  onClick={() => setPreferredLanguage('en')}
                  title="Switch to English"
                >
                  EN
                </button>
                <button
                  className={`${styles.langButton} ${preferredLanguage === 'ur' ? styles.activeLang : ''}`}
                  onClick={() => setPreferredLanguage('ur')}
                  title="Switch to Urdu"
                >
                  UR
                </button>
              </div>
              <button
                className={`${styles.streamToggle} ${useStreaming ? styles.activeStream : ''}`}
                onClick={() => setUseStreaming(!useStreaming)}
                title={useStreaming ? 'Streaming enabled (faster)' : 'Streaming disabled'}
              >
                {useStreaming ? '⚡' : '📄'}
              </button>
            </div>
          </div>

          {/* Selected Text Indicator */}
          {selectedText && (
            <div className={styles.selectedTextBanner}>
              <span>Selected: "{selectedText.slice(0, 50)}{selectedText.length > 50 ? '...' : ''}"</span>
              <div className={styles.selectionControls}>
                <label className={styles.strictModeToggle} title="Strict mode: Answer ONLY from selected text">
                  <input
                    type="checkbox"
                    checked={strictMode}
                    onChange={(e) => setStrictMode(e.target.checked)}
                  />
                  <span className={styles.toggleLabel}>Strict</span>
                </label>
                <button onClick={() => setSelectedText('')}>Clear</button>
              </div>
            </div>
          )}

          <div className={styles.messagesContainer}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <p>Welcome! I'm the Physical AI & Humanoid Robotics Book Assistant.</p>
                <p className={styles.tip}>Say "Hi" to get started, or ask any question!</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage} ${msg.isStreaming ? styles.streaming : ''}`}
              >
                {msg.content || (msg.isStreaming && (
                  <span className={styles.cursor}>▌</span>
                ))}
                {msg.isStreaming && msg.content && (
                  <span className={styles.cursor}>▌</span>
                )}
              </motion.div>
            ))}
            {isLoading && !isStreaming && (
              <div className={styles.message + ' ' + styles.assistantMessage}>
                <div className={styles.typingIndicator}>
                  <span>Thinking</span>
                  <div className={styles.dots}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Feature 3: Queue indicator */}
          {messageQueue.length > 0 && (
            <motion.div
              className={styles.queueIndicator}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {messageQueue.length} message{messageQueue.length > 1 ? 's' : ''} queued
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className={styles.inputContainer}>
            <motion.input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isLoading || isStreaming
                  ? "Type your next question..."
                  : selectedText
                  ? "Ask about selected text..."
                  : "Say hi or ask a question..."
              }
              className={styles.input}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            />
            {isStreaming ? (
              <motion.button
                type="button"
                onClick={stopStreaming}
                className={styles.stopButton}
                title="Stop generating"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={styles.sendButton}
                whileHover={!input.trim() || isLoading ? {} : { scale: 1.05 }}
                whileTap={!input.trim() || isLoading ? {} : { scale: 0.95 }}
              >
                {isLoading ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.spinner}>
                    <circle cx="12" cy="12" r="10" strokeDasharray="31.4 31.4" strokeLinecap="round"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </motion.button>
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
