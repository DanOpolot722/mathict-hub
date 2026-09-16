# Mr. Opolot Dan — Mathematics & ICT Learning Hub

A modern, responsive web application for Mr. Opolot Dan, a qualified Secondary School Teacher of Mathematics and ICT in Uganda. Built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**.

---

## ⚠️ Why double-clicking `index.html` does not work

This is a modern **React + Vite** single-page application.
- Modern browsers cannot execute `.tsx` (TypeScript React) files directly.
- Browsers also block local module scripts when opened directly via `file:///...` due to browser CORS security.
- To run this application locally, you run the Vite development server using **Node.js**, or build it into static production files (`npm run build`).

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer (v18 or higher is recommended).

### Steps
1. Open your terminal / command prompt in the project folder:
   ```bash
   cd mathict-hub
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open the link shown in your terminal (usually `http://localhost:3000` or `http://localhost:5173`) in your web browser.

---

## 🌐 Deploy to GitHub Pages (Automated)

This repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Update Math & ICT Learning Hub"
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. GitHub will automatically build and deploy your site to:
   `https://<your-username>.github.io/<repo-name>/`

---

## 📦 Building Static Files for Production

If you want the compiled static HTML, CSS, and JS files:
```bash
npm run build
```
This will compile the entire app into the `dist/` folder, ready to be hosted on any static web host or CDN.

---

## 🛠️ Project Structure

```
mathict-hub/
├── .github/workflows/deploy.yml   GitHub Pages automated deployment
├── index.html                     Entry HTML
├── package.json                   Project dependencies and scripts
├── vite.config.ts                 Vite build configuration (with base: './')
├── public/                        Public assets (photos, icons)
│   └── assets/
│       ├── dan-portrait.jpg       Teacher portrait photo
│       └── dan-avatar.jpg         Teacher avatar photo
└── src/
    ├── App.tsx                    Main app router & navigation
    ├── main.tsx                   React entry point
    ├── data/                      Syllabus, past papers, questions, resources data
    ├── components/                Page views & UI components
    │   ├── HomeView.tsx           Homepage with hero, stats, quick links
    │   ├── ResourcesView.tsx      S1–S6 Math & S1–S4 ICT curriculum resources
    │   ├── PastPapersView.tsx     UNEB past papers & marking guides
    │   ├── PracticeView.tsx       Interactive practice quizzes & step-by-step solutions
    │   ├── SupportView.tsx        WhatsApp inquiry & student support forms
    │   ├── AboutView.tsx          Teacher profile & qualifications
    │   ├── AdminView.tsx          Teacher admin panel
    │   ├── AnnouncementBar.tsx    Live announcement banner
    │   └── WhatsAppButton.tsx     Floating WhatsApp button & modal
    └── lib/                       Helper utilities
```
