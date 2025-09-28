require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Using project ID for development - in production, use service account key
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: 'simhealth-842b1',
      // For development, we'll use the default credentials
      // In production, you should use a service account key file
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin. Ensure credentials are configured.', error);
    console.log('Note: For development, make sure you have Firebase CLI installed and authenticated');
    console.log('Run: firebase login && firebase use simhealth-842b1');
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

// ESP32 Device Management
const db = admin.firestore();

// In-memory storage for device status (for development)
const deviceStatus = new Map();

// ESP32 device registration endpoint (simplified for development)
app.post('/api/esp32/register', async (req, res) => {
  try {
    const { deviceId, patientId, deviceName } = req.body;
    
    if (!deviceId || !patientId) {
      return res.status(400).json({ error: 'Device ID and Patient ID are required' });
    }

    // Store device registration in memory
    const deviceInfo = {
      deviceId,
      patientId,
      deviceName: deviceName || `ESP32-${deviceId}`,
      registeredAt: new Date().toISOString(),
      isActive: true,
      lastSeen: new Date().toISOString(),
      batteryLevel: null
    };
    
    deviceStatus.set(deviceId, deviceInfo);
    
    console.log('ESP32 Device Registration:', deviceInfo);

    res.json({ 
      success: true, 
      message: 'ESP32 device registered successfully',
      deviceId,
      patientId 
    });
  } catch (error) {
    console.error('ESP32 registration error:', error);
    res.status(500).json({ error: 'Failed to register ESP32 device' });
  }
});

// ESP32 send vital signs data (simplified for development)
app.post('/api/esp32/vitals', async (req, res) => {
  try {
    const { 
      deviceId, 
      timestamp, 
      heartRate, 
      temperature, 
      spo2, 
      ecgData, 
      bloodPressure, 
      respiratoryRate,
      batteryLevel 
    } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID is required' });
    }

    // Update device status with latest data
    if (deviceStatus.has(deviceId)) {
      const deviceInfo = deviceStatus.get(deviceId);
      deviceInfo.lastSeen = new Date().toISOString();
      deviceInfo.batteryLevel = batteryLevel || deviceInfo.batteryLevel;
      deviceStatus.set(deviceId, deviceInfo);
    }

    // Log the vital signs data
    console.log('Vital Signs Data Received:', {
      deviceId,
      timestamp: timestamp || new Date().toISOString(),
      heartRate,
      temperature,
      spo2,
      bloodPressure,
      respiratoryRate,
      batteryLevel,
      ecgDataLength: ecgData ? ecgData.length : 0
    });

    res.json({ 
      success: true, 
      message: 'Vital signs data received successfully'
    });
  } catch (error) {
    console.error('Vital signs storage error:', error);
    res.status(500).json({ error: 'Failed to store vital signs data' });
  }
});

// Get patient vital signs for doctors
app.get('/api/vitals/:patientId', verifyFirebaseIdToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 100, startAfter } = req.query;

    // Verify doctor has access to this patient
    const doctorRef = db.collection('doctors').doc(req.user.uid);
    const doctorDoc = await doctorRef.get();
    
    if (!doctorDoc.exists) {
      return res.status(403).json({ error: 'Doctor access required' });
    }

    // Get patient info
    const patientRef = db.collection('patients').doc(patientId);
    const patientDoc = await patientRef.get();
    
    if (!patientDoc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Get vital signs data
    let query = db.collection('vital_signs')
      .where('patientId', '==', patientId)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit));

    if (startAfter) {
      const startAfterDoc = await db.collection('vital_signs').doc(startAfter).get();
      query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.get();
    const vitals = [];
    
    snapshot.forEach(doc => {
      vitals.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
      });
    });

    res.json({
      success: true,
      patientId,
      vitals,
      count: vitals.length
    });
  } catch (error) {
    console.error('Get vitals error:', error);
    res.status(500).json({ error: 'Failed to retrieve vital signs' });
  }
});

// Get real-time vital signs (latest data)
app.get('/api/vitals/:patientId/latest', verifyFirebaseIdToken, async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verify doctor access
    const doctorRef = db.collection('doctors').doc(req.user.uid);
    const doctorDoc = await doctorRef.get();
    
    if (!doctorDoc.exists) {
      return res.status(403).json({ error: 'Doctor access required' });
    }

    // Get latest vital signs
    const snapshot = await db.collection('vital_signs')
      .where('patientId', '==', patientId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        patientId,
        latestVitals: null,
        message: 'No vital signs data available'
      });
    }

    const latestDoc = snapshot.docs[0];
    const latestVitals = {
      id: latestDoc.id,
      ...latestDoc.data(),
      timestamp: latestDoc.data().timestamp?.toDate?.() || latestDoc.data().timestamp
    };

    res.json({
      success: true,
      patientId,
      latestVitals
    });
  } catch (error) {
    console.error('Get latest vitals error:', error);
    res.status(500).json({ error: 'Failed to retrieve latest vital signs' });
  }
});

// Get ESP32 device status (real-time)
app.get('/api/esp32/status/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Get real device status from memory
    if (!deviceStatus.has(deviceId)) {
      return res.status(404).json({ 
        success: false,
        error: 'ESP32 device not found. Please register the device first.',
        device: null
      });
    }

    const deviceInfo = deviceStatus.get(deviceId);
    
    // Check if device is online (last seen within 2 minutes)
    const lastSeen = new Date(deviceInfo.lastSeen);
    const now = new Date();
    const timeDiff = (now.getTime() - lastSeen.getTime()) / 1000; // seconds
    const isOnline = timeDiff < 120; // 2 minutes

    const realDeviceStatus = {
      ...deviceInfo,
      isOnline: isOnline,
      timeSinceLastSeen: Math.round(timeDiff) // seconds since last seen
    };

    res.json({
      success: true,
      device: realDeviceStatus
    });
  } catch (error) {
    console.error('Get device status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get device status: ' + error.message,
      device: null
    });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


