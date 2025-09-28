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

// ESP32 Device Management
const db = admin.firestore();

// ESP32 device registration endpoint
app.post('/api/esp32/register', async (req, res) => {
  try {
    const { deviceId, patientId, deviceName } = req.body;
    
    if (!deviceId || !patientId) {
      return res.status(400).json({ error: 'Device ID and Patient ID are required' });
    }

    // Check if patient exists
    const patientRef = db.collection('patients').doc(patientId);
    const patientDoc = await patientRef.get();
    
    if (!patientDoc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Register ESP32 device
    const deviceRef = db.collection('esp32_devices').doc(deviceId);
    await deviceRef.set({
      deviceId,
      patientId,
      deviceName: deviceName || `ESP32-${deviceId}`,
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      lastSeen: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update patient record with device info
    await patientRef.update({
      esp32DeviceId: deviceId,
      hasDevice: true
    });

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

// ESP32 send vital signs data
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

    // Verify device exists and get patient ID
    const deviceRef = db.collection('esp32_devices').doc(deviceId);
    const deviceDoc = await deviceRef.get();
    
    if (!deviceDoc.exists) {
      return res.status(404).json({ error: 'ESP32 device not registered' });
    }

    const deviceData = deviceDoc.data();
    const patientId = deviceData.patientId;

    // Store vital signs data
    const vitalsRef = db.collection('vital_signs').doc();
    await vitalsRef.set({
      deviceId,
      patientId,
      timestamp: timestamp || admin.firestore.FieldValue.serverTimestamp(),
      heartRate: heartRate || null,
      temperature: temperature || null,
      spo2: spo2 || null,
      ecgData: ecgData || null, // Array of ECG readings
      bloodPressure: bloodPressure || null, // {systolic, diastolic}
      respiratoryRate: respiratoryRate || null,
      batteryLevel: batteryLevel || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update device last seen
    await deviceRef.update({
      lastSeen: admin.firestore.FieldValue.serverTimestamp(),
      batteryLevel: batteryLevel || deviceData.batteryLevel
    });

    res.json({ 
      success: true, 
      message: 'Vital signs data stored successfully',
      vitalsId: vitalsRef.id 
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

// Get ESP32 device status
app.get('/api/esp32/status/:deviceId', verifyFirebaseIdToken, async (req, res) => {
  try {
    const { deviceId } = req.params;

    const deviceRef = db.collection('esp32_devices').doc(deviceId);
    const deviceDoc = await deviceRef.get();
    
    if (!deviceDoc.exists) {
      return res.status(404).json({ error: 'ESP32 device not found' });
    }

    const deviceData = deviceDoc.data();
    
    // Check if device is online (last seen within 5 minutes)
    const lastSeen = deviceData.lastSeen?.toDate?.() || new Date(0);
    const isOnline = (Date.now() - lastSeen.getTime()) < 5 * 60 * 1000; // 5 minutes

    res.json({
      success: true,
      device: {
        ...deviceData,
        lastSeen: lastSeen,
        isOnline
      }
    });
  } catch (error) {
    console.error('Get device status error:', error);
    res.status(500).json({ error: 'Failed to get device status' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


