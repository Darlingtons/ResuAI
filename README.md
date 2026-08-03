# ResuAI - Premium AI Resume & Cover Letter Suite

ResuAI is a professional, high-performance web application designed to help job seekers build ATS-friendly resumes, grade them against job descriptions, and write tailored cover letters utilizing advanced AI patterns.

## 🚀 Key Features

*   **Premium Resume Builder:** Built with light/dark glassmorphic styles. Choose from multiple professional templates (Classic, Slate, Modern, Minimal) and edit details in real-time with responsive A4 page previewing and 1-click print-to-PDF formatting.
*   **ATS Checker & Scorer:** Upload a resume PDF to parse text (client-side via PDF.js) and compute an instantaneous matching score against target jobs, featuring itemized feedback on word counts, structure, and keyword optimizations.
*   **AI Cover Letter Wizard:** A 4-step wizard that:
    1.  Uploads and validates CV/Resume text (verifies page limits and structural resume headings).
    2.  Ingests targeted job descriptions and requirements.
    3.  Configures writing tone (Professional, Creative, Enthusiastic, Confident) and experience level.
    4.  Runs matching algorithms to align qualifications and output a downloadable A4-formatted letter.
*   **Secure Subscriptions (Razorpay Payments):** Complete checkout flows using Razorpay payment widgets and cryptographic signature verification. Integrates with Google Firebase Firestore to instantly unlock Pro features upon checkout.

---

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), React Router v7, Lucide Icons, PDF.js
*   **Backend:** Node.js, Express, Razorpay SDK, Firebase Admin SDK
*   **Database & Auth:** Google Firebase (Authentication & Cloud Firestore)

---

## 💻 Local Setup & Installation

### 1. Prerequisite: Clone the Repository
```bash
git clone https://github.com/Darlingtons/ResuAI.git
cd ResuAI
```

### 2. Configure Frontend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root folder:
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

## 🔒 Security Configuration (.gitignore)
The project is configured to keep all private tokens, credentials, and API environment variables secure. The `.gitignore` file automatically blocks:
*   `.env` (Frontend & Backend local keys)
*   `serviceAccountKey.json` (Firebase Service Account private key)
*   `node_modules` and compiled build folders (`dist/`)

---

## 🌐 Production Deployment

### Frontend (Vercel)
Deploy the React application on Vercel:
1. Connect Vercel to your GitHub repository.
2. Set Framework Preset to **Vite**.
3. Add the `VITE_RAZORPAY_KEY_ID` under **Environment Variables**.
4. Deploy!

### Backend (Render / Railway)
Deploy the Express server on Render:
1. Create a new **Web Service** on Render connected to this repository.
2. Set root directory to `server`.
3. Set build command to `npm install` and start command to `node server.js`.
4. Add environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and copy-paste the entire contents of your `serviceAccountKey.json` file into `FIREBASE_SERVICE_ACCOUNT`.
