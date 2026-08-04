# 🚀 ResuAI - Premium AI Resume & Cover Letter Suite

ResuAI is a professional, high-performance web application designed to help job seekers build ATS-friendly resumes, grade them against job descriptions, and write tailored cover letters utilizing advanced AI.

---

## 🚀 Key Features

* **Premium Resume Builder**: Built with light/dark glassmorphic styles. Choose from multiple professional templates (Classic, Slate, Modern, Minimal) and edit details in real-time with responsive A4 page previewing and 1-click print-to-PDF formatting.
* **ATS Checker & Scorer**: Upload a resume PDF to parse text (client-side via PDF.js) and compute an instantaneous matching score against target jobs, featuring itemized feedback on word counts, structure, and keyword optimizations.
* **AI Cover Letter Wizard**: A 4-step wizard that uploads and validates CV text, ingests targeted job descriptions, configures writing tone, and outputs a downloadable A4-formatted letter.
* **Secure Subscriptions (Razorpay Payments)**: Complete checkout flows using Razorpay payment widgets and cryptographic signature verification. Integrates with Google Firebase Firestore to instantly upgrade user accounts.
* **SEO & Analytics Ready**: Out-of-the-box SEO optimizations including dynamic metadata, Open Graph cards, Google Analytics tracker, Google AdSense ads, custom XML sitemaps, and robots.txt configurations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), React Router v7, Lucide Icons, PDF.js |
| **Backend** | Node.js, Express, Razorpay SDK, Firebase Admin SDK |
| **Database & Auth** | Google Firebase (Authentication & Cloud Firestore) |

---

## 💻 Local Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Darlingtons/ResuAI.git
cd ResuAI
```

### 2. Configure Frontend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root folder and add your key details:
   ```env
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   # Firebase Web Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### 3. Configure Backend (Server)
1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Place your Firebase Admin Service Account Key JSON as `serviceAccountKey.json` in the `server/` directory.
3. Create a `.env` file in the `server/` folder:
   ```env
   PORT=3001
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
4. Start the server:
   ```bash
   node server.js
   ```

---

## 🌐 Production Deployment

This project is configured to deploy directly to **Vercel** as a full-stack application (frontend SPA + backend serverless functions):

### Environment Setup on Vercel
In your Vercel Project Settings, add the following Environment Variables:
1. `VITE_RAZORPAY_KEY_ID` (Frontend & Backend key ID)
2. `RAZORPAY_KEY_ID` (Backend key ID)
3. `RAZORPAY_KEY_SECRET` (Backend secret key)
4. `FIREBASE_SERVICE_ACCOUNT` (Paste the raw JSON content of your `serviceAccountKey.json`)

---

## 🔒 Security & Git configuration
The project uses a structured `.gitignore` to keep credentials secure. Never commit the following files:
* `.env` & `server/.env`
* `serviceAccountKey.json`
* `node_modules/` or build output `dist/`
