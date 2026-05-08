# ChezzyPufft Security Overview

**Document ID:** ChezzyPufft-Security-Overview
**Version:** 1.0
**Last Updated:** 2026-05-08
**Maintainer:** Mark LaPointe <mark@cloudbsd.org>
**Status:** ACTIVE
**Classification:** PUBLIC

---

## Security Model

### Trust Boundaries
- **Browser** <-> **Emby Server** (localhost or trusted network)
- **API Client** <-> **REST/WebSocket API**

### Authentication
- Session-based authentication via Emby server
- Access tokens stored in memory (Zustand store)
- No persistent credentials in browser storage

### Data Sensitivity
| Data | Sensitivity | Protection |
|------|-------------|------------|
| User credentials | High | Via Emby server |
| Media metadata | Low | Public |
| Playback state | Low | Session only |

---

## Security Controls

### Input Validation
- All API responses are validated against TypeScript interfaces
- User input sanitized before rendering
- CSP headers configured

### XSS Prevention
- React handles escaping by default
- No `dangerouslySetInnerHTML` usage
- Strict Content Security Policy

### CSRF Prevention
- API uses token-based authentication
- Same-origin requests only

---

## Compliance

- WCAG 2.1 Level AA accessibility
- No PII stored locally
- No third-party analytics

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-08 | Mark LaPointe | Initial version |

**Last Updated:** 2026-05-08 12:00 UTC
**Contact:** mark@cloudbsd.org
**Classification:** PUBLIC
