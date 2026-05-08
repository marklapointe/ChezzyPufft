# ChezzyPufft Threat Model

**Document ID:** ChezzyPufft-Security-ThreatModel
**Version:** 1.0
**Last Updated:** 2026-05-08
**Maintainer:** Mark LaPointe <mark@cloudbsd.org>
**Status:** ACTIVE
**Classification:** PUBLIC

---

## Threat Modeling Overview

### Application Purpose
WebUI client for Emby media server - displays media, provides playback controls, and manages user preferences.

### Trust Level
- High trust: Emby server (local or same network)
- Medium trust: Browser environment

---

## Identified Threats

### T1: Session Hijacking
**Severity:** Medium
**Vector:** XSS or man-in-middle
**Mitigation:** HttpOnly cookies, CSP, token rotation

### T2: API Abuse
**Severity:** Low
**Vector:** Malicious client requests
**Mitigation:** Server-side validation, rate limiting

### T3: Malicious Media Files
**Severity:** Low
**Vector:** Subtitle injection, malformed metadata
**Mitigation:** Server-side sanitization, sandboxed playback

### T4: Dependency Compromise
**Severity:** Medium
**Vector:** Supply chain attack
**Mitigation:** Lockfile verification, npm audit, dependency pinning

---

## Out of Scope
- Server-side vulnerabilities (handled by Emby Go server)
- Network infrastructure security
- Browser extension attacks

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-08 | Mark LaPointe | Initial version |

**Last Updated:** 2026-05-08 12:00 UTC
**Contact:** mark@cloudbsd.org
**Classification:** PUBLIC
