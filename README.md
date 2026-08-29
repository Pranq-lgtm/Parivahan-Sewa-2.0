# Parivahan Sewa 2.O (Citizen Transport Portal)

A modern, task-based, accessible redesign of India's **Parivahan Sewa** portal adhering to **WCAG 2.1 AA** guidelines.

---

## 📁 Project Structure

```text
Parivahan Seva 2.O/
├── package.json               # Project manifest and scripts
├── README.md                  # Documentation and run instructions
└── src/
    ├── frontend/              # Presentation & Client-side logic
    │   ├── index.html         # Semantic HTML5 markup with Tailwind CSS & FontAwesome
    │   ├── styles.css         # Custom animations, ticker, and High-Contrast mode
    │   └── app.js             # Tab switcher, bottom-sheet login modal & drawer logic
    └── backend/               # Server-side API & static file delivery
        └── server.js          # Express.js server with mock transport API endpoints
```

---

## 🚀 How to Run

### Option 1: Using the Node.js Express Backend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

### Option 2: Direct Static Frontend
You can open `src/frontend/index.html` directly in any web browser or use VSCode Live Server.

---

## ✨ Implemented Specification Highlights

1. **Utility Top-Bar**:
   - Screen Reader accessibility link.
   - Text size toggles (`A-`, `A`, `A+`) dynamically adjusting root font scale.
   - High Contrast accessibility mode toggle.
   - Language selector (`EN` / `HI`).
   - Unified Login button.

2. **Main Header & Information Architecture**:
   - Government of India emblem & Parivahan branding.
   - Mega dropdown menus:
     - *Driving License* (Apply, Renew, Duplicate, IDP, Status, Mock Tests)
     - *Vehicle Registration* (New, Transfer, Address Change, Renew, Fancy Number)
     - *Commercial & Transport* (Permits, Fitness, Scrapping, Trade Certs)
     - *Compliance* (eChallan, PUCC, Vehicle Recall)
     - *Information & Help* (Acts, Fees, Forms, Dashboards, FAQs)
   - Global search input and mobile drawer menu.

3. **Hero & Universal Search**:
   - Vibrant Navy-to-Blue gradient with abstract pattern.
   - Interactive 3-tab search (`Vehicle RC`, `Driving License`, `eChallan`) with dynamic placeholders.
   - Responsive scrolling notification ticker directly below search.

4. **Citizen Services Grid**:
   - 6 high-demand quick actions with hover-lift micro-interactions and icons.

5. **Audience Portals**:
   - Side-by-side featured portals for **Commercial Services** and **Industry Services**.

6. **Unified Login Modal / Bottom Sheet**:
   - Responsive design: slides up as a bottom sheet on mobile devices and renders as a centered modal dialog on desktop.
