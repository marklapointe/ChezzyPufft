# ChezzyPufft Deployment

**Document ID:** ChezzyPufft-Deployment
**Version:** 1.0
**Last Updated:** 2026-05-08
**Maintainer:** Mark LaPointe <mark@cloudbsd.org>
**Status:** ACTIVE
**Classification:** PUBLIC

---

## Deployment Targets

| Platform | Method | Notes |
|----------|--------|-------|
| Ubuntu 22.04+ | apt + systemd | Primary |
| FreeBSD 14+ | pkg + rc.d | Secondary |
| Docker | Container | Development |

---

## Ubuntu Deployment

### Prerequisites
```bash
nodejs >= 18.0
npm >= 9.0
```

### Installation
```bash
npm install
npm run build
systemctl enable emby-webui
```

### Configuration
Config at `/usr/local/etc/chezzy pufft/emby-webui.conf.json`:
```json
{
  "apiUrl": "http://localhost:8096",
  "wsUrl": "ws://localhost:8096"
}
```

---

## FreeBSD Deployment

### Prerequisites
```bash
pkg install node18 npm
```

### Installation
```bash
npm install
npm run build
```

### Service
RC.d script at `/usr/local/etc/rc.d/emby-webui`

---

## Docker Deployment

```bash
docker build -t chezzypufft .
docker run -p 3000:3000 \
  -e API_URL=http://emby-server:8096 \
  chezzypufft
```

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-08 | Mark LaPointe | Initial version |

**Last Updated:** 2026-05-08 12:00 UTC
**Contact:** mark@cloudbsd.org
**Classification:** PUBLIC
