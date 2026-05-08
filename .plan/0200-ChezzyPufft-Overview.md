# ChezzyPufft Overview

**Document ID:** ChezzyPufft-Overview
**Version:** 1.0
**Last Updated:** 2026-05-08
**Maintainer:** Mark LaPointe <mark@cloudbsd.org>
**Status:** ACTIVE
**Classification:** PUBLIC

---

## Project Description

**ChezzyPufft** is a modern TypeScript/React webui that serves as a drop-in replacement for the Emby web interface. It communicates with the existing Emby Go backend via its REST API and WebSocket interfaces.

### Key Goals
1. Migrate from vanilla JavaScript (RequireJS/Bower) to TypeScript/React
2. Maintain 100% functional equivalence with original webui
3. Improve code quality, testability, and maintainability
4. Target platforms: Linux (Ubuntu), FreeBSD

### Target Users
- Emby media server administrators
- Emby media server users (browsing, playback)

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| State | Zustand |
| i18n | i18next |
| Build | Vite |
| Testing | Jest + React Testing Library |
| Player | HLS.js, Howler.js |

---

## Project Structure

```
 ChezzyPufft/
├── src/
│   ├── api/          # API client and types
│   ├── components/    # React components
│   ├── pages/        # Route pages
│   ├── store/        # Zustand stores
│   └── locales/      # i18n translations
├── .plan/            # CloudBSD planning docs
├── .vscode/          # VS Code config
├── .idea/            # IntelliJ config
└── public/           # Static assets
```

---

## Related Projects

| Project | Relationship |
|---------|--------------|
| Emby (C#) | API backend (reference) |
| emby-go | Go reimplementation (reference) |

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-08 | Mark LaPointe | Initial version |

**Last Updated:** 2026-05-08 12:00 UTC
**Contact:** mark@cloudbsd.org
**Classification:** PUBLIC
