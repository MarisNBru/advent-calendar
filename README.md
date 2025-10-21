# 🎄 Adventskalender 2025

Eine interaktive, responsive Adventskalender-Website mit React, Vite, TypeScript und Tailwind CSS – **optimiert für GitHub Pages**.

![Advent Calendar Preview](https://via.placeholder.com/800x400/dc2626/ffffff?text=Advent+Calendar+2025)

## ✨ Features

- 🎁 **24 Doors** with different content types:
  - 📝 Text messages
  - 🖼️ Images
  - 🎟️ Vouchers with QR codes
  - 🔗 Links
  - 🎵 Optional: Audio
- 🇲🇽 **Mexican & German Traditions** - Special designs for cultural holidays:
  - 🌹 **Day 12**: Día de la Virgen de Guadalupe (rose theme)
  - 🏠 **Days 16-24**: Las Posadas (9-day celebration with candles)
  - 🎅 **Day 6**: St. Nicholas Day (German tradition)
  - 🎁 **Day 24**: Noche Buena (Mexican Christmas Eve)
- 🎨 **Dynamic Door Designs** - Each door has unique colors and emojis based on the celebration
- 🔒 **Time-based Unlocking** (Europe/Berlin timezone)
- 💾 **LocalStorage** saves opened doors
- 🔑 **Secret Mode** (press `#` to unlock all doors)
- � **Dark Mode** via `prefers-color-scheme`
- ♿ **Accessibility** (ARIA labels, keyboard navigation)
- 📱 **Responsive Design** (mobile-first)
- 🎬 **Animations** with Framer Motion
- 🔍 **Preview Mode** (`?preview=true`)
- 🌍 **Bilingual** (English with Spanish phrases)

## 🚀 GitHub Pages Deployment

### Schritt 1: Repository vorbereiten

1. **Repository auf GitHub erstellen**
   ```bash
   # Initialisiere Git (falls noch nicht geschehen)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Füge Remote hinzu (ersetze <USERNAME> und <REPO_NAME>)
   git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```

2. **Base-Path in `vite.config.ts` anpassen**
   
   Öffne `vite.config.ts` und ändere den `base`-Wert:
   
   **Für Project Pages** (`https://<username>.github.io/<repo-name>/`):
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/<REPO_NAME>/',  // ← Ersetze mit deinem Repo-Namen
     // ...
   })
   ```
   
   **Für User/Org Pages** (`https://<username>.github.io/`):
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/',  // ← Root-Pfad für User Pages
     // ...
   })
   ```

3. **404.html anpassen** (nur für Project Pages)
   
   Öffne `public/404.html` und aktualisiere den `baseUrl`:
   ```javascript
   const baseUrl = '/<REPO_NAME>/'; // ← Muss mit vite.config.ts übereinstimmen
   ```

### Schritt 2: GitHub Actions aktivieren

1. Gehe zu deinem Repository auf GitHub
2. Navigiere zu **Settings** → **Pages**
3. Unter **Source** wähle: **GitHub Actions**

   ![GitHub Pages Settings](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/publishing-source-drop-down.webp)

### Schritt 3: Deploy auslösen

Der Workflow (`.github/workflows/deploy.yml`) wird automatisch ausgelöst bei:
- `git push` auf den `main` Branch
- Manuell über **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### Schritt 4: Überprüfung

1. Gehe zu **Actions** und warte, bis der Workflow ✅ grün ist
2. Öffne deine Website:
   - Project Pages: `https://<username>.github.io/<repo-name>/`
   - User Pages: `https://<username>.github.io/`

## 🛠️ Lokale Entwicklung

### Voraussetzungen

- Node.js (v18 oder höher)
- npm oder yarn

### Installation

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev
```

Öffne [http://localhost:5173](http://localhost:5173) im Browser.

### Build für Produktion

```bash
npm run build

# Preview des Builds
npm run preview
```

## 📝 Inhalte anpassen

### Calendar-Daten bearbeiten

Öffne `public/data/calendar.json` und bearbeite die Einträge:

```json
{
  "day": 1,
  "type": "text",
  "title": "Dein Titel",
  "content": "Deine Nachricht"
}
```

**Verfügbare Typen:**

- **text**: Reine Textnachricht
  ```json
  {
    "day": 1,
    "type": "text",
    "title": "Willkommen",
    "content": "Deine Nachricht hier..."
  }
  ```

- **image**: Bild mit optionalem Text
  ```json
  {
    "day": 2,
    "type": "image",
    "title": "Winterzauber",
    "content": "Beschreibung",
    "imageUrl": "https://example.com/image.jpg"
  }
  ```

- **voucher**: Gutschein mit QR-Code
  ```json
  {
    "day": 3,
    "type": "voucher",
    "title": "Gutschein",
    "content": "Einlösen für...",
    "voucherCode": "CODE-2025",
    "voucherValidUntil": "31.12.2025"
  }
  ```

- **link**: Externer Link
  ```json
  {
    "day": 4,
    "type": "link",
    "title": "Playlist",
    "content": "Beschreibung",
    "linkUrl": "https://example.com"
  }
  ```

### Personalisierung

- **Titel ändern**: `index.html` → `<title>` Tag
- **Header anpassen**: `src/components/Header.tsx`
- **Farben ändern**: Tailwind-Klassen in Komponenten
- **Zeitzone ändern**: `src/utils/dateUtils.ts` → `TIMEZONE`

## 🐛 Troubleshooting

### Problem: Leere weiße Seite nach Deploy

**Ursache:** Base-Path in `vite.config.ts` ist falsch.

**Lösung:**
1. Überprüfe `vite.config.ts`: `base: '/<REPO_NAME>/'`
2. Stelle sicher, dass `<REPO_NAME>` **exakt** mit dem GitHub-Repo übereinstimmt
3. Commit & Push die Änderung

### Problem: 404 bei Direct Links

**Ursache:** HashRouter wird nicht korrekt verwendet.

**Lösung:**
- Die App nutzt bereits `HashRouter` → URLs haben `#` (z.B. `/#/`)
- `404.html` leitet automatisch um

### Problem: Assets laden nicht (CSS/JS 404)

**Ursache:** Relative Pfade sind falsch.

**Lösung:**
1. Überprüfe `vite.config.ts` → `base` korrekt?
2. Stelle sicher, dass Assets mit `import.meta.env.BASE_URL` geladen werden
3. Browser-Cache leeren (Strg+Shift+R)

### Problem: Türchen öffnen nicht zur richtigen Zeit

**Ursache:** Zeitzone oder lokale Systemzeit falsch.

**Lösung:**
- Überprüfe `src/utils/dateUtils.ts` → `TIMEZONE = 'Europe/Berlin'`
- Teste mit Preview-Modus: `?preview=true`
- **Secret Mode**: Drücke `#` auf der Tastatur zum Freischalten aller Türchen

## 📦 Projekt-Struktur

```
advent-calendar/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions Workflow
├── public/
│   ├── data/
│   │   └── calendar.json       # 24 Türchen-Inhalte
│   └── 404.html                # SPA-Fallback für GitHub Pages
├── src/
│   ├── components/
│   │   ├── ContentRenderer.tsx # Rendert Inhaltstypen
│   │   ├── DayModal.tsx        # Modal für geöffnetes Türchen
│   │   ├── DoorCard.tsx        # Einzelnes Türchen
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── hooks/
│   │   └── useAdventState.ts   # LocalStorage-Hook
│   ├── utils/
│   │   └── dateUtils.ts        # Zeitzone & Freischaltung
│   ├── types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts              # ⚠️ Hier base-path anpassen!
├── tailwind.config.js
├── package.json
└── README.md
```

## 🔧 Technologien

- **React 18** – UI-Framework
- **Vite 5** – Build-Tool
- **TypeScript** – Type-Safety
- **Tailwind CSS** – Styling
- **Framer Motion** – Animationen
- **date-fns-tz** – Zeitzone-Handling
- **qrcode** – QR-Code-Generierung
- **React Router** – HashRouter für GitHub Pages

## 📄 Lizenz

MIT License – Frei verwendbar für private und kommerzielle Projekte.

## 🎅 Viel Spaß!

Frohe Weihnachten und eine besinnliche Adventszeit! 🎄✨

---

**Erstellt mit ❤️ für GitHub Pages**
