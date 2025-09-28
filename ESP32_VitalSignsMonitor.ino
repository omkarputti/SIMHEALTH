/*
 * SIMHEALTH ESP32 Vital Signs Monitor
 * 
 * This Arduino code demonstrates how to send vital signs data
 * from an ESP32 device to the SIMHEALTH backend API.
 * 
 * Required Libraries:
 * - WiFi (built-in)
 * - HTTPClient (built-in)
 * - ArduinoJson (install via Library Manager)
 * - MAX3010x Sensor Library by SparkFun (for heart rate and SpO2)
 * - MLX90614 by Adafruit (for temperature)
 * - Wire (built-in for I2C communication)
 * 
 * Hardware Setup:
 * - ESP32 Dev Board
 * - MAX30102 Heart Rate & SpO2 Sensor
 * - MLX90614 Temperature Sensor
 * - AD8232 ECG Sensor
 * - Optional: Battery level monitoring
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <MAX30105.h>
#include <heartRate.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// SIMHEALTH API configuration
const char* apiBaseUrl = "http://localhost:4000"; // Change to your backend URL
const char* deviceId = "ESP32_001"; // Unique device ID - change this for each device

// Sensor pins and variables
const int ECG_PIN = 34; // ADC pin for ECG
const int BATTERY_PIN = 35; // ADC pin for battery monitoring

// MAX30102 sensor object
MAX30105 particleSensor;

// Sensor data variables
float heartRate = 0;
float temperature = 0;
float spo2 = 0;
float batteryLevel = 0;
int ecgData[100]; // Array to store ECG readings
int ecgIndex = 0;

// Timing variables
unsigned long lastDataSend = 0;
const unsigned long DATA_SEND_INTERVAL = 30000; // Send data every 30 seconds

void setup() {
  Serial.begin(115200);
  
  // Initialize sensors
  initializeSensors();
  
  // Connect to WiFi
  connectToWiFi();
  
  // Register device with backend
  registerDevice();
  
  Serial.println("ESP32 Vital Signs Monitor initialized");
}

void loop() {
  // Read sensor data
  readSensorData();
  
  // Send data to backend every 30 seconds
  if (millis() - lastDataSend >= DATA_SEND_INTERVAL) {
    sendVitalSignsData();
    lastDataSend = millis();
  }
  
  delay(100); // Small delay for stability
}

void initializeSensors() {
  // Initialize I2C for sensors
  Wire.begin();
  
  // Initialize MAX30102 (Heart Rate & SpO2)
  if (particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 sensor found!");
    
    // Configure sensor settings
    particleSensor.setup(); // Default settings
    particleSensor.setPulseAmplitudeRed(0x0A); // Turn Red LED to low to indicate sensor is running
    particleSensor.setPulseAmplitudeGreen(0); // Turn off Green LED
  } else {
    Serial.println("MAX30102 sensor not found. Check wiring!");
  }
  
  // Initialize MLX90614 (Temperature)
  // Note: Add MLX90614 library initialization here
  
  Serial.println("Sensors initialized");
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void registerDevice() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(apiBaseUrl) + "/api/esp32/register");
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    DynamicJsonDocument doc(1024);
    doc["deviceId"] = deviceId;
    doc["patientId"] = "1"; // This should be set based on pairing
    doc["deviceName"] = "ESP32 Health Monitor";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Device registration response: " + response);
    } else {
      Serial.println("Error registering device: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

void readSensorData() {
  // Read Heart Rate and SpO2 from MAX30102
  readMAX30102Data();
  
  // Read Temperature (simulated - replace with actual MLX90614 reading)
  temperature = 36.5 + random(-5, 10) / 10.0; // Simulate temperature between 36.0-37.5°C
  
  // Read ECG data
  readECGData();
  
  // Read battery level
  batteryLevel = readBatteryLevel();
  
  // Print sensor readings
  Serial.println("=== Sensor Readings ===");
  Serial.println("Heart Rate: " + String(heartRate) + " BPM");
  Serial.println("Temperature: " + String(temperature) + " °C");
  Serial.println("SpO2: " + String(spo2) + "%");
  Serial.println("Battery: " + String(batteryLevel) + "%");
  Serial.println("======================");
}

void readECGData() {
  // Read ECG data from AD8232
  for (int i = 0; i < 100; i++) {
    ecgData[i] = analogRead(ECG_PIN);
    delay(10); // Small delay between readings
  }
}

void readMAX30102Data() {
  // Read data from MAX30102 sensor
  uint32_t ir, red;
  
  // Get IR and Red LED readings
  ir = particleSensor.getIR();
  red = particleSensor.getRed();
  
  // Simple heart rate calculation (you can improve this)
  // This is a basic implementation - for production, use proper algorithms
  static unsigned long lastBeat = 0;
  static int beatCount = 0;
  
  if (ir > 50000) { // Threshold for detecting pulse
    if (millis() - lastBeat > 500) { // Minimum 500ms between beats
      beatCount++;
      lastBeat = millis();
    }
  }
  
  // Calculate heart rate (beats per minute)
  if (beatCount > 0) {
    heartRate = (beatCount * 60000.0) / millis();
  } else {
    heartRate = 70 + random(-10, 15); // Fallback to simulated data
  }
  
  // Simple SpO2 calculation (you can improve this)
  // This is a basic implementation - for production, use proper algorithms
  float ratio = (float)red / (float)ir;
  spo2 = 100 - (ratio * 10); // Simplified calculation
  
  if (spo2 < 90) spo2 = 90; // Minimum SpO2
  if (spo2 > 100) spo2 = 100; // Maximum SpO2
}

float readBatteryLevel() {
  // Read battery voltage and convert to percentage
  int batteryValue = analogRead(BATTERY_PIN);
  float voltage = (batteryValue / 4095.0) * 3.3; // Convert to voltage
  float percentage = (voltage / 4.2) * 100; // Assuming 4.2V is full charge
  
  if (percentage > 100) percentage = 100;
  if (percentage < 0) percentage = 0;
  
  return percentage;
}

void sendVitalSignsData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(apiBaseUrl) + "/api/esp32/vitals");
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    DynamicJsonDocument doc(2048);
    doc["deviceId"] = deviceId;
    doc["timestamp"] = millis(); // Current timestamp
    doc["heartRate"] = heartRate;
    doc["temperature"] = temperature;
    doc["spo2"] = spo2;
    doc["respiratoryRate"] = 16 + random(-4, 4); // Simulate respiratory rate
    doc["batteryLevel"] = batteryLevel;
    
    // Add ECG data array
    JsonArray ecgArray = doc.createNestedArray("ecgData");
    for (int i = 0; i < 100; i++) {
      ecgArray.add(ecgData[i]);
    }
    
    // Add blood pressure (simulated)
    JsonObject bp = doc.createNestedObject("bloodPressure");
    bp["systolic"] = 120 + random(-10, 15);
    bp["diastolic"] = 80 + random(-5, 10);
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.println("Sending data to backend...");
    Serial.println("Payload: " + jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Backend response: " + response);
      
      // Parse response to check for success
      DynamicJsonDocument responseDoc(1024);
      deserializeJson(responseDoc, response);
      
      if (responseDoc["success"]) {
        Serial.println("✓ Vital signs data sent successfully!");
      } else {
        Serial.println("✗ Failed to send data: " + String(responseDoc["error"].as<String>()));
      }
    } else {
      Serial.println("✗ HTTP Error: " + String(httpResponseCode));
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected. Cannot send data.");
  }
}

// Additional utility functions

void printWiFiStatus() {
  Serial.println("=== WiFi Status ===");
  Serial.println("SSID: " + String(WiFi.SSID()));
  Serial.println("IP Address: " + WiFi.localIP().toString());
  Serial.println("Signal Strength: " + String(WiFi.RSSI()) + " dBm");
  Serial.println("==================");
}

void deepSleepMode() {
  // Put ESP32 into deep sleep to save battery
  Serial.println("Entering deep sleep mode...");
  esp_deep_sleep_start();
}

// Error handling functions
void handleSensorError(String sensorName) {
  Serial.println("ERROR: " + sensorName + " sensor not responding!");
  // Implement error handling logic here
}

void handleWiFiError() {
  Serial.println("ERROR: WiFi connection lost!");
  // Attempt to reconnect
  WiFi.reconnect();
}

/*
 * Installation Instructions:
 * 
 * 1. Install required libraries:
 *    - ArduinoJson by Benoit Blanchon
 *    - MAX3010x Sensor Library by SparkFun Electronics
 *    - MLX90614 by Adafruit
 * 
 * 2. Hardware connections:
 *    - Connect MAX30102 to ESP32 I2C pins (SDA: GPIO21, SCL: GPIO22)
 *    - Connect MLX90614 to ESP32 I2C pins
 *    - Connect AD8232 ECG sensor to GPIO34 (ADC)
 *    - Connect battery voltage divider to GPIO35 (ADC)
 * 
 * 3. Update configuration:
 *    - Change WiFi credentials
 *    - Update API base URL
 *    - Set unique device ID
 *    - Adjust sensor pins if needed
 * 
 * 4. Upload code to ESP32
 * 
 * 5. Monitor serial output for debugging
 * 
 * Note: This is a basic implementation. For production use,
 * add proper error handling, sensor calibration, and security measures.
 */
