require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const websiteRoutes = require('./routes/websiteRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Needed on Vercel so secure cookies work behind the proxy
app.set('trust proxy', 1);

// Allowed origins: local dev + production frontend(s) from env
// Example: FRONTEND_URL=https://my-dashboard.vercel.app,https://mydomain.com
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
    : []),
];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, server-to-server, browser address bar)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ---------- MongoDB connection (cached for serverless) ----------
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => {
        console.log('MongoDB connected');
        return m;
      })
      .catch((err) => {
        // Reset so the next request can retry
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

const dbStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

// ---------- Status routes (no DB middleware, so they work even if DB fails) ----------

// Root URL: simple message so opening the bare domain does not show a 404
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is live. Open /api for full status.',
  });
});

// Open https://your-backend.vercel.app/api to check deployment status
app.get('/api', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbError = null;

  try {
    await connectDB();
    dbStatus = dbStates[mongoose.connection.readyState];
  } catch (err) {
    dbStatus = 'error';
    dbError = err.message;
  }

  const ok = dbStatus === 'connected';

  res.status(ok ? 200 : 500).json({
    success: ok,
    message: ok
      ? 'API is running and database is connected'
      : 'API is running but database has a problem',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      name: ok ? mongoose.connection.name : null,
      error: dbError,
    },
    config: {
      // Only true/false, never the actual secret values
      mongoUriSet: !!process.env.MONGO_URI,
      jwtSecretSet: !!process.env.JWT_SECRET,
      frontendUrlSet: !!process.env.FRONTEND_URL,
      cloudinarySet: !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ),
    },
    allowedOrigins,
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    database: dbStates[mongoose.connection.readyState],
  });
});

// ---------- Make sure DB is connected before the real routes ----------
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler (shows method and path to make debugging easier)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
  });
});

// Error handler (also catches CORS and multer errors)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// Listen only when running locally (Vercel does not need this)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel serverless
module.exports = app;