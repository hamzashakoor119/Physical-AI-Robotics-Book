# ADR-003: Frontend Architecture for Documentation Platform

## Status
Accepted

## Date
2024-12-10

## Context
We need a frontend framework for the Physical AI & Humanoid Robotics textbook that:
- Renders markdown content efficiently
- Supports syntax highlighting for code examples
- Provides good SEO for educational content
- Allows embedding interactive components (chat widget)
- Supports dark/light theme

## Decision
We chose **Docusaurus** as the documentation framework:

### Framework: Docusaurus 3.x
- **Rationale**:
  - Purpose-built for documentation
  - Built-in versioning support
  - Excellent MDX support for interactive content
  - Strong SEO out of the box
  - Active community and maintenance by Meta
- **Alternative Considered**:
  - GitBook (limited customization)
  - VuePress (Vue ecosystem, smaller community)
  - Next.js (more setup required for docs)
  - MkDocs (Python-based, less React integration)

### Component Library: React
- **Rationale**: Docusaurus is React-based, enabling custom components
- **ChatWidget**: Custom React component for RAG chatbot
- **Theme Customization**: Swizzling for advanced customization

### Styling: CSS Modules + CSS Variables
- **Rationale**: Scoped styles prevent conflicts, variables enable theming
- **Alternative Considered**: Tailwind (adds build complexity), Styled-components (runtime overhead)

## Consequences

### Positive
- Fast development with markdown content
- Automatic sidebar generation from file structure
- Built-in search (Algolia DocSearch compatible)
- Mobile-responsive by default
- Easy deployment to GitHub Pages/Vercel

### Negative
- React dependency for custom components
- Learning curve for swizzling
- Build time increases with content volume

### Implementation Notes
- Use sidebar_position in frontmatter for ordering
- Implement ChatWidget via Root theme wrapper
- Enable dark mode via colorMode config
- Configure proper base URL for deployment
