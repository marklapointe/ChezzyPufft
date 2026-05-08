# ChezzyPufft Access Control

**Document ID:** ChezzyPufft-Security-AccessControl
**Version:** 1.0
**Last Updated:** 2026-05-08
**Maintainer:** Mark LaPointe <mark@cloudbsd.org>
**Status:** ACTIVE
**Classification:** PUBLIC

---

## Access Control Matrix

### Unauthenticated Users
| Resource | Permission |
|----------|------------|
| /login | Allow |
| / | Redirect to /login |

### Authenticated Users
| Resource | Permission |
|----------|------------|
| /home | Allow |
| /movies | Allow |
| /tv | Allow |
| /music | Allow |
| /livetv | Allow |
| /search | Allow |
| /dashboard/* | Admin only |
| /settings/* | Allow |

### Admin Users
| Resource | Permission |
|----------|------------|
| All pages | Allow |
| Server configuration | Allow |

---

## Implementation

- React Router protected routes
- Server validates all requests
- Client-side checks are UX only

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-08 | Mark LaPointe | Initial version |

**Last Updated:** 2026-05-08 12:00 UTC
**Contact:** mark@cloudbsd.org
**Classification:** PUBLIC
