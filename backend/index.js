require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Prefer GOOGLE_APPLICATION_CREDENTIALS or Workload Identity; falls back to default
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin. Ensure credentials are configured.', error);
    process.exit(1);
  }
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'SIMHEALTH API is running',
    health: '/health',
    protected_example: '/api/protected (requires Authorization: Bearer <idToken>)'
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Middleware to verify Firebase ID Token sent via Authorization: Bearer <token>
async function verifyFirebaseIdToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const parts = authHeader.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;
    if (!token) {
      return res.status(401).json({ error: 'Missing auth token' });
    }
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/protected', verifyFirebaseIdToken, (req, res) => {
  res.json({ message: 'Protected data', uid: req.user.uid, role: req.user.role || null });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


