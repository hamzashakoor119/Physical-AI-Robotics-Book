# Theme Customizer - Docusaurus Styling Skill

## Auto-Generated
- **Created**: 2025-12-30
- **Created By**: Master Skill Factory
- **Project**: Physical AI Textbook Hackathon
- **Reuse Count**: 0

## Purpose
Customize Docusaurus theme with professional, modern color schemes. Create AI-themed, tech-focused, or custom branded designs for the textbook website.

## Trigger Phrases
- "theme change karo"
- "colors update karo"
- "professional theme banao"
- "AI theme lagao"
- "dark mode fix karo"
- "styling update karo"

## Project Files Reference
```
src/css/custom.css              # Main custom styles
docusaurus.config.ts            # Theme config (prism, colorMode)
src/components/*/styles.module.css  # Component styles
```

## Color Palette Templates

### 1. AI/Tech Theme (Orange + Dark)
```css
--ifm-color-primary: #f97316;        /* Orange */
--ifm-color-primary-dark: #ea580c;
--ifm-color-primary-darker: #c2410c;
--ifm-color-primary-darkest: #9a3412;
--ifm-color-primary-light: #fb923c;
--ifm-color-primary-lighter: #fdba74;
--ifm-color-primary-lightest: #fed7aa;
--ifm-background-color: #0f172a;     /* Dark blue-gray */
```

### 2. Robotics Theme (Teal + Blue)
```css
--ifm-color-primary: #14b8a6;        /* Teal */
--ifm-color-primary-dark: #0d9488;
--ifm-color-primary-darker: #0f766e;
--ifm-color-primary-darkest: #115e59;
--ifm-color-primary-light: #2dd4bf;
--ifm-color-primary-lighter: #5eead4;
--ifm-color-primary-lightest: #99f6e4;
```

### 3. NVIDIA Theme (Green + Black)
```css
--ifm-color-primary: #76b900;        /* NVIDIA Green */
--ifm-color-primary-dark: #629a00;
--ifm-color-primary-darker: #4d7a00;
--ifm-color-primary-darkest: #3d6100;
--ifm-color-primary-light: #8ed600;
--ifm-color-primary-lighter: #a6f200;
--ifm-color-primary-lightest: #c4ff33;
```

### 4. Professional Blue
```css
--ifm-color-primary: #3b82f6;        /* Blue */
--ifm-color-primary-dark: #2563eb;
--ifm-color-primary-darker: #1d4ed8;
--ifm-color-primary-darkest: #1e40af;
--ifm-color-primary-light: #60a5fa;
--ifm-color-primary-lighter: #93c5fd;
--ifm-color-primary-lightest: #bfdbfe;
```

## Implementation Steps

### Step 1: Update custom.css
Location: `src/css/custom.css`

```css
/* Light Mode */
:root {
  --ifm-color-primary: #COLOR;
  --ifm-color-primary-dark: #COLOR;
  /* ... other shades */

  --ifm-background-color: #ffffff;
  --ifm-font-family-base: 'Inter', system-ui, sans-serif;
}

/* Dark Mode */
[data-theme='dark'] {
  --ifm-color-primary: #COLOR;
  --ifm-background-color: #0f172a;
  --ifm-background-surface-color: #1e293b;
}
```

### Step 2: Add Custom Elements
```css
/* Hero Section */
.hero {
  background: linear-gradient(135deg, #color1, #color2);
}

/* Cards */
.card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Buttons */
.button--primary {
  background: linear-gradient(135deg, #color1, #color2);
  border: none;
}

/* Code Blocks */
.prism-code {
  border-radius: 8px;
}
```

### Step 3: Update docusaurus.config.ts
```typescript
themeConfig: {
  colorMode: {
    defaultMode: 'light',
    disableSwitch: false,
    respectPrefersColorScheme: true,
  },
  prism: {
    theme: prismThemes.github,      // Light
    darkTheme: prismThemes.dracula, // Dark
  },
}
```

## Quick Apply Commands

### Apply AI/Orange Theme:
```bash
# Update custom.css with AI theme colors
# Then rebuild
npm run build
```

### Test Theme:
```bash
npm start
# Check both light and dark modes
```

## Color Tools
- Generate shades: https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima
- Color palette: https://coolors.co
- Contrast checker: https://webaim.org/resources/contrastchecker/

## Checklist
- [ ] Light mode colors set
- [ ] Dark mode colors set
- [ ] Hero section styled
- [ ] Buttons styled
- [ ] Code blocks styled
- [ ] Footer styled
- [ ] Both modes tested
- [ ] Accessibility checked (contrast)

---

## Version
- **Version**: 1.0.0
- **Category**: Frontend Skills
- **Integration**: Docusaurus CSS
