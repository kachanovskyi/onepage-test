# Onepage — Tagline Editor Test Task

Frontend test task for the Onepage no-code website builder.

## Overview
This project implements an interactive **Tagline element editor** with a live preview and a settings panel, based on the provided Figma design.

The editor allows:
- Managing tagline items (labels + links)
- Editing styles (variant, size, radius, alignment)
- Instant visual preview updates
- Simulated persistence layer (debounced POST logging)

## Tech Stack
- React
- TypeScript
- MobX
- CSS Modules

## Architecture Notes
- Scalable editor architecture with isolated panels (Main / Item / Styles)
- Shared UI primitives (Chip, Segmented) reused across preview and panels
- Centralized editor store controlling active panel state
- Designed to support future element types beyond Tagline

## Running Locally
```bash
npm install
npm run dev
```
