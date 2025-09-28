# SIMHEALTH ESP32 Integration

This document explains how to integrate ESP32 hardware with the SIMHEALTH platform for real-time vital signs monitoring.

## Overview

The ESP32 integration allows patients to connect their health monitoring devices to the SIMHEALTH platform, enabling doctors to view real-time vital signs data including:

- **Heart Rate** (BPM)
- **Temperature** (°C)
- **SpO₂** (Oxygen Saturation %)
- **ECG** (Electrocardiogram data)
- **Blood Pressure** (Systolic/Diastolic)
- **Respiratory Rate** (breaths/min)
- **Battery Level** (%)

## Architecture

```
ESP32 Device → WiFi → Backend API → Firebase → Frontend Dashboard
```

### Components

1. **ESP32 Hardware**: Collects vital signs data from various sensors
2. **Backend API**: Receives and stores data in Firebase Firestore
3. **Frontend**: Displays real-time data to doctors and patients
4. **Firebase**: Database and real-time synchronization

## Backend API Endpoints

### Device Registration
```
POST /api/esp32/register
Content-Type: application/json

{
  "deviceId": "ESP32_001",
  "patientId": "patient_uid",
  "deviceName": "My Health Monitor"
}
```

### Send Vital Signs Data
```
POST /api/esp32/vitals
Content-Type: application/json

{
  "deviceId": "ESP32_001",
  "timestamp": 1640995200000,
  "heartRate": 75,
  "temperature": 36.5,
  "spo2": 98,
  "ecgData": [512, 515, 518, ...],
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "respiratoryRate": 16,
  "batteryLevel": 85
}
```

### Get Patient Vital Signs (Doctor)
```
GET /api/vitals/{patientId}
Authorization: Bearer <firebase_token>

Query Parameters:
- limit: Number of records (default: 100)
- startAfter: Pagination cursor
```

### Get Latest Vital Signs
```
GET /api/vitals/{patientId}/latest
Authorization: Bearer <firebase_token>
```

### Get Device Status
```
GET /api/esp32/status/{deviceId}
Authorization: Bearer <firebase_token>
```

## Database Schema

### ESP32 Devices Collection
```javascript
{
  deviceId: "ESP32_001",
  patientId: "patient_uid",
  deviceName: "My Health Monitor",
  registeredAt: timestamp,
  isActive: true,
  lastSeen: timestamp,
  batteryLevel: 85
}
```

### Vital Signs Collection
```javascript
{
  deviceId: "ESP32_001",
  patientId: "patient_uid",
  timestamp: timestamp,
  heartRate: 75,
  temperature: 36.5,
  spo2: 98,
  ecgData: [512, 515, 518, ...],
  bloodPressure: {
    systolic: 120,
    diastolic: 80
  },
  respiratoryRate: 16,
  batteryLevel: 85,
  createdAt: timestamp
}
```

## Frontend Components

### Patient Dashboard
- **ESP32DevicePairing**: Allows patients to pair their ESP32 device
- Device status monitoring
- Battery level tracking
- Connection status indicators

### Doctor Dashboard
- **VitalSignsMonitor**: Real-time vital signs display
- Historical data charts
- ECG waveform visualization
- Alert system for critical values
- Device status monitoring

## Hardware Requirements

### ESP32 Development Board
- ESP32-WROOM-32 or similar
- WiFi connectivity
- ADC pins for sensor readings
- I2C interface for digital sensors

### Sensors
- **MAX30102**: Heart rate and SpO₂ monitoring
- **MLX90614**: Non-contact temperature sensor
- **AD8232**: ECG sensor module
- **Voltage divider**: Battery level monitoring

### Optional Components
- OLED display for local readings
- Buzzer for alerts
- LED indicators for status
- Battery pack for portable operation

## Software Setup

### ESP32 Arduino Code
1. Install required libraries:
   ```bash
   ArduinoJson by Benoit Blanchon
   MAX30102lib by SparkFun
   MLX90614 by Adafruit
   ```

2. Update configuration in `ESP32_VitalSignsMonitor.ino`:
   - WiFi credentials
   - API base URL
   - Device ID
   - Sensor pins

3. Upload code to ESP32

### Backend Setup
1. Ensure Firebase Admin SDK is configured
2. Start the backend server:
   ```bash
   cd backend
   npm install
   npm start
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Usage Workflow

### For Patients
1. **Register Account**: Create patient account on SIMHEALTH
2. **Pair Device**: Enter ESP32 device ID in patient dashboard
3. **Monitor**: Device automatically sends vital signs data
4. **Track Status**: View device connection and battery status

### For Doctors
1. **Login**: Access doctor dashboard
2. **Select Patient**: Choose patient from list
3. **View Data**: Real-time vital signs monitoring
4. **Analyze Trends**: Historical data visualization
5. **Respond to Alerts**: Critical value notifications

## Security Considerations

### Authentication
- Firebase ID tokens for API access
- Device registration validation
- Patient-doctor relationship verification

### Data Privacy
- Encrypted data transmission (HTTPS)
- Secure Firebase rules
- Patient consent for data sharing

### Device Security
- Unique device IDs
- Device registration validation
- Battery monitoring for tampering detection

## Troubleshooting

### Common Issues

1. **Device Not Connecting**
   - Check WiFi credentials
   - Verify API URL accessibility
   - Check device ID uniqueness

2. **Data Not Sending**
   - Verify backend server is running
   - Check Firebase configuration
   - Monitor serial output for errors

3. **Frontend Not Updating**
   - Check Firebase authentication
   - Verify API endpoints
   - Check browser console for errors

### Debugging Tips

1. **ESP32 Serial Monitor**: Monitor device output
2. **Backend Logs**: Check server console
3. **Firebase Console**: Monitor database updates
4. **Browser DevTools**: Check network requests

## Future Enhancements

### Planned Features
- **Real-time WebSocket**: Instant data updates
- **Machine Learning**: Anomaly detection
- **Mobile App**: Dedicated mobile interface
- **Multi-device Support**: Multiple sensors per patient
- **Cloud Storage**: Historical data backup
- **API Rate Limiting**: Prevent data flooding
- **Device Firmware Updates**: OTA updates

### Advanced Sensors
- **Blood Glucose**: Continuous monitoring
- **Blood Pressure**: Cuffless measurement
- **Sleep Monitoring**: Sleep quality analysis
- **Activity Tracking**: Step count and movement

## Support

For technical support or questions about the ESP32 integration:

1. Check the troubleshooting section
2. Review the Arduino code comments
3. Monitor serial output for error messages
4. Check Firebase console for data flow
5. Verify API endpoints with tools like Postman

## License

This ESP32 integration code is part of the SIMHEALTH project and follows the same licensing terms.
