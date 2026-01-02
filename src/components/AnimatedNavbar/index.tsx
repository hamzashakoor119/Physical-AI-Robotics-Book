import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import styles from './styles.module.css';

interface NavbarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface AnimatedNavbarProps {
  title: string;
  items: NavbarItem[];
  logo?: React.ReactNode;
}

export default function AnimatedNavbar({
  title,
  items,
  logo,
}: AnimatedNavbarProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Logo/Brand */}
        <motion.a
          href="/"
          className={styles.brand}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className={styles.logoIcon}
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            {logo || '🤖'}
          </motion.span>
          <span className={styles.brandText}>{title}</span>
        </motion.a>

        {/* Nav Items */}
        <div className={styles.navItems}>
          {items.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className={styles.navItem}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <motion.span
                className={styles.navIcon}
                animate={{
                  rotate: hoveredItem === index ? 360 : 0,
                  scale: hoveredItem === index ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {item.icon}
              </motion.span>
              <span className={styles.navLabel}>{item.label}</span>
              <motion.div
                className={styles.navUnderline}
                initial={false}
                animate={{
                  width: hoveredItem === index ? '100%' : '0%',
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Mobile menu button */}
        <motion.button
          className={styles.mobileMenuBtn}
          whileTap={{ scale: 0.9 }}
        >
          <span />
          <span />
          <span />
        </motion.button>
      </div>
    </nav>
  );
}

export const AnimatedSearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={styles.searchBar}
      animate={{
        width: isFocused ? 300 : 200,
      }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <motion.span
        animate={{ rotate: isFocused ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        🔍
      </motion.span>
      <input
        type="text"
        placeholder="Search..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </motion.div>
  );
};

export const AnimatedThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <motion.button
      className={styles.themeToggle}
      onClick={() => setIsDark(!isDark)}
      whileTap={{ scale: 0.9 }}
      whileHover={{ rotate: 180 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            ☀️
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            🌙
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
