# ChezzyPufft Workflow

**Document ID:** ChezzyPufft-Workflow
**Version:** 1.0
**Last Updated:** 2026-05-08
**Maintainer:** Mark LaPointe <mark@cloudbsd.org>
**Status:** ACTIVE
**Classification:** PUBLIC

---

## Task Claiming Protocol

### Before Starting Work
1. Assign the issue to yourself
2. Create a branch from `master`
3. Update `0002-ChezzyPufft-Build-Status.md` with your task
4. File must include your initials and timestamp

### During Work
1. Commit atomically (one logical change per commit)
2. Run tests before pushing (`npm test`)
3. Run linting before pushing (`npm run lint`)
4. Update task status in `0002-ChezzyPufft-Build-Status.md`

### After Completing Work
1. Ensure all tests pass
2. Ensure coverage is 100% or max achievable
3. Open PR with description referencing issue
4. Request review from maintainer

---

## Commit Message Format

```
<type>(<scope>): <description>

[Optional body]

[Optional footer]
```

### Types
| Type | Usage |
|------|-------|
| `init` | Project initialization |
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring |
| `test` | Adding/updating tests |
| `docs` | Documentation |
| `chore` | Build/tooling changes |
| `i18n` | Internationalization |
| `migrate` | Migration from legacy |
| `perf` | Performance improvements |
| `a11y` | Accessibility |
| `pwa` | PWA features |
| `security` | Security hardening |

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-08 | Mark LaPointe | Initial version |

**Last Updated:** 2026-05-08 12:00 UTC
**Contact:** mark@cloudbsd.org
**Classification:** PUBLIC
