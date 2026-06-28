# Production Deployment Guide

We have optimized the codebase for deployment, eliminated all ESLint errors/warnings, and created automation scripts. Here is how you can deploy the TaskFlow application to production.

---

## 1. Local Monorepo Automation
We added a root-level `package.json` that automates installation and building of both backend and frontend. You can run:
* **Install and Build everything**: `npm run build`
* **Start production server**: `npm start`

---

## 2. Deploying to Render / Heroku (Recommended)
Since the Express backend is configured to host the static React frontend files directly in production (`NODE_ENV=production`), you can deploy the entire repository as a single Web Service.

### Setup Settings:
1. **Root Directory**: Leave blank (use the repository root).
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   * `NODE_ENV`: `production`
   * `PORT`: `3000` (or whatever the host provides)
   * `MONGO_URI`: `mongodb+srv://...` (your Atlas MongoDB connection string)

---

## 3. Deploying Frontend and Backend Separately

### Backend (e.g., Render, Heroku, Railway):
* **Build Command**: `npm install`
* **Start Command**: `npm start`
* **Environment Variables**:
  * `MONGO_URI`: `mongodb+srv://...`

### Frontend (e.g., Vercel, Netlify):
* **Root Directory**: `frontend`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**:
  * `VITE_API_URL`: Set this to your deployed backend URL (e.g., `https://your-backend-url.onrender.com/api`)
