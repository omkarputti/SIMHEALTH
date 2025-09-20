# 🏥 SIMHEALTH – Multimodal Disease Predictor & Clinical-Grade Report Generator

This is a **React + Vite + TailwindCSS** web application prototype for **AI-powered multimodal health screening and report generation**.

---

## 🚀 Features

- Landing page with medical theme and explainer
- Role-based login (Doctor / Patient / Guest Demo)
- **Patient Dashboard**

  - First-time users: onboarding form (personal details)
  - Upload new health data (images, audio, vitals, sensors)
  - Health snapshot cards with traffic-light indicators
  - Report history and PDF export

- **Doctor Dashboard**

  - Patient list with risk alerts
  - Report viewer (SHAP charts, Grad-CAM heatmaps, metrics)
  - Risk trends graph and emergency alerts

- Report page with patient/doctor split view + Digital Twin
- Help page (chatbot support) & Contact Info
- Responsive, clean medical UI (white + soft blue/green)

---

## 🖥️ Steps to Run Locally

1. **Unzip / Clone Repo**

   ```bash
   git clone https://github.com/omkarputti/SIMHEALTH.git
   cd SIMHEALTH
   ```

2. **Open in VS Code (or any editor/terminal)**

3. **Check Node.js**

   ```bash
   node -v
   ```

   - Install [Node.js LTS](https://nodejs.org/) (recommended v18+) if missing.

4. **Install Dependencies**

   ```bash
   npm install
   ```

5. **Run Development Server**

   ```bash
   npm run dev
   ```

   - Local server: [http://localhost:5173](http://localhost:5173)

---

## ⚠️ Common Issues

- **Port already in use (5173):**

  ```bash
  npm run dev -- --port 3000
  ```

- **Tailwind not applying styles:**

  - Ensure `postcss.config.js` and `tailwind.config.js` exist.
  - Check that `index.css` imports Tailwind directives.

- **TypeScript errors:**

  - Safe to ignore during prototyping if the app runs fine.

---

## 📌 Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Charts:** Recharts
- **Icons:** Lucide-react
- **PDF Export & QR placeholder**

---

## 👩‍⚕️👨‍⚕️ Credits

- Team MediCrafters --
