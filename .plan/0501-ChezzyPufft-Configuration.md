# ChezzyPufft Configuration Reference

**Document ID:** ChezzyPufft-Configuration
**Version:** 1.0
**Last Updated:** 2026-05-08
**Maintainer:** Mark LaPointe <mark@cloudbsd.org>
**Status:** ACTIVE
**Classification:** PUBLIC

---

## Configuration File Locations

| Platform | Path |
|---------|------|
| Linux (XDG) | `$XDG_CONFIG_HOME/chezzypufft/emby-webui.conf.json` |
| Linux (fallback) | `~/.config/chezzypufft/emby-webui.conf.json` |
| FreeBSD | `/usr/local/etc/chezzypufft/emby-webui.conf.json` |

---

## Configuration Schema

```typescript
interface EmbyWebUIConfig {
  apiUrl: string;        // Emby server URL
  wsUrl?: string;        // WebSocket URL (default: apiUrl with ws://)
  language?: string;     // UI language (default: en-US)
  theme?: 'light' | 'dark';
}
```

---

## Example Configuration

```json
{
  "apiUrl": "http://localhost:8096",
  "wsUrl": "ws://localhost:8096",
  "language": "en-US",
  "theme": "dark"
}
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EMBY_API_URL` | Emby server URL | `http://localhost:8096` |
| `EMBY_WS_URL` | WebSocket URL | (derived) |
| `NODE_ENV` | Environment | `production` |

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-08 | Mark LaPointe | Initial version |

**Last Updated:** 2026-05-08 12:00 UTC
**Contact:** mark@cloudbsd.org
**Classification:** PUBLIC
