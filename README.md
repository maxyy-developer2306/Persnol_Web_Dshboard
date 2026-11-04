# MAXYY Website Manager

A professional, minimal Website Management Dashboard built with the MERN stack. Manage multiple websites from one centralized dashboard.

## Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, Lucide React, Axios, React Router DOM, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, cookie-parser, dotenv, CORS

## Folder Structure

```
website-manager/
  frontend/      # Vite + React app
  backend/       # Node.js + Express API
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Install Dependencies

```bash
# Backend
cd website-manager/backend
npm install

# Frontend
cd website-manager/frontend
npm install
```

### 2. Configure Environment Variables

Create/edit the `.env` files (already included, update values as needed).

**backend/.env**
```
MONGO_URI=mongodb://127.0.0.1:27017/website_manager
JWT_SECRET=your_strong_jwt_secret_change_in_production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ENCRYPTION_KEY=thisis32byteencryptionkey!!!
PORT=4000
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**frontend/.env**
```
VITE_API_URL=http://localhost:4000
```

> ⚠️ Never commit `.env` files to GitHub. They are listed in `.gitignore`.

### 3. Run in Development

```bash
# Backend (terminal 1)
cd website-manager/backend
npm run dev

# Frontend (terminal 2)
cd website-manager/frontend
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173

### 4. Login

Use the admin credentials from `backend/.env`:
- Username: `admin`
- Password: `admin123`

## Features

- JWT authentication with HTTP-only secure cookies
- Add, edit, archive, delete, restore, and permanently delete websites
- Website credentials encrypted at rest (AES-256-CBC)
- Passwords never exposed to unauthenticated users
- Search, filter by status, sort by newest/oldest
- Responsive sidebar and mobile navigation
- Toast notifications and confirmation dialogs
- Empty-state and loading UI

## Deployment (Vercel)

### Backend
Deploy the `backend` folder to a Node.js hosting provider (e.g., Render, Railway, Fly.io, or a VPS). Vercel is primarily for frontend; for backend use a dedicated Node host.

### Frontend (Vercel)
1. Push the `frontend` folder (or the whole repo) to GitHub.
2. Import the project in Vercel.
3. Set the build command: `npm run build`
4. Set the output directory: `dist`
5. Install the Vercel CLI or connect the GitHub repo.

### Environment Variables for Production

**Backend (set on your Node host):**
- `MONGO_URI` — your production MongoDB connection string
- `JWT_SECRET` — a strong random secret
- `ADMIN_USERNAME` — your admin username
- `ADMIN_PASSWORD` — your admin password
- `ENCRYPTION_KEY` — a 32-byte encryption key
- `CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
- `CLOUDINARY_API_KEY` — your Cloudinary API key
- `CLOUDINARY_API_SECRET` — your Cloudinary API secret
- `PORT` — e.g. `4000` or the host's assigned port
- `FRONTEND_URL` — your production frontend URL (for CORS)
- `NODE_ENV=production`

**Frontend (set in Vercel):**
- `VITE_API_URL` — your production backend URL (e.g., `https://api.yourdomain.com`)

### CORS
The backend CORS is configured to allow only `FRONTEND_URL` with credentials enabled. Update `FRONTEND_URL` in production to your actual frontend domain.

## Security Notes

- `.env` files are never committed to GitHub.
- Backend secrets (JWT_SECRET, MONGO_URI, ADMIN_PASSWORD, ENCRYPTION_KEY) are never exposed to the frontend.
- Website passwords are encrypted at rest in MongoDB.
- Authentication uses HTTP-only secure cookies.
- All dashboard routes are protected by JWT middleware.

## Scripts

Backend:
- `npm start` — production server
- `npm run dev` — development with nodemon

Frontend:
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build