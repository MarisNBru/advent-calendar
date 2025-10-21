# Advent Calendar Quick Start

## 🚀 Schnellstart

```bash
# 1. Dependencies installieren
npm install

# 2. Dev-Server starten
npm run dev

# 3. Im Browser öffnen: http://localhost:5173
```

## 📝 Vor dem Deploy

### Wichtig: Base-Path anpassen!

1. **Öffne `vite.config.ts`**
2. **Ändere die Zeile:**
   ```typescript
   base: '/advent-calendar/',  // ← Ersetze "advent-calendar" mit DEINEM Repo-Namen
   ```
3. **Öffne `public/404.html`**
4. **Ändere die Zeile:**
   ```javascript
   const baseUrl = '/advent-calendar/'; // ← Muss identisch sein!
   ```

## 📦 Deployment Checkliste

- [ ] Repository auf GitHub erstellt
- [ ] `vite.config.ts` → `base` angepasst
- [ ] `public/404.html` → `baseUrl` angepasst
- [ ] `public/data/calendar.json` → Inhalte personalisiert
- [ ] Code committed und gepusht
- [ ] GitHub Settings → Pages → Source: **GitHub Actions**
- [ ] Workflow abgeschlossen (grüner Haken)
- [ ] Website getestet: `https://{username}.github.io/{repo-name}/`

## 🎨 Personalisierung

- **Titel**: `index.html` + `src/components/Header.tsx`
- **Inhalte**: `public/data/calendar.json`
- **Farben**: Tailwind-Klassen in Komponenten

## 🐛 Häufige Probleme

### Weiße Seite nach Deploy
→ Base-Path in `vite.config.ts` falsch

### Assets 404
→ Browser-Cache leeren (Strg+Shift+R)

### Türchen öffnen nicht
→ Preview-Modus: `?preview=true` in URL

## 📖 Vollständige Anleitung

Siehe [README.md](./README.md) für Details!
