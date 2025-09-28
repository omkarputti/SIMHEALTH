/*
 * SIMHEALTH ESP32 Vital Signs Monitor - SIMPLIFIED VERSION
 * 
 * This version works WITHOUT external sensors for testing purposes.
 * It generates simulated vital signs data to test the connection.
 * 
 * Required Libraries:
 * - WiFi (built-in)
 * - HTTPClient (built-in)
 * - ArduinoJson (install via Library Manager)
 * - Wire (built-in)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>

// WiFi credentials - UPDATED!
const char* ssid = "Airtel_shiv_7415";
const char* password = "875779";

// SIMHEALTH API configuration - UPDATED!
const char* apiBaseUrl = "http://172.23.40.2:4000"; // Your computer's IP address
const char* deviceId = "ESP32_001"; // Make this unique for each device

// Sensor data variables (simulated)
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
  
  // Initialize I2C (even though we're not using sensors yet)
  Wire.begin();
  
  // Connect to WiFi
  connectToWiFi();
  
  // Register device with backend
  registerDevice();
  
  Serial.println("ESP32 Vital Signs Monitor (Simplified) initialized");
  Serial.println("Note: Using simulated sensor data for testing");
}

void loop() {
  // Read simulated sensor data
  readSimulatedSensorData();
  
  // Send data to backend every 30 seconds
  if (millis() - lastDataSend >= DATA_SEND_INTERVAL) {
    sendVitalSignsData();
    lastDataSend = millis();
  }
  
  delay(100); // Small delay for stability
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
    doc["deviceName"] = "ESP32 Health Monitor (Test)";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.println("Registering device...");
    Serial.println("Payload: " + jsonString);
    
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

void readSimulatedSensorData() {
  // Simulate Heart Rate (60-100 BPM)
  heartRate = 70 + random(-10, 20);
  
  // Simulate Temperature (36.0-37.5°C)
  temperature = 36.5 + random(-5, 10) / 10.0;
  
  // Simulate SpO2 (95-100%)
  spo2 = 98 + random(-3, 2);
  
  // Simulate ECG data (sine wave pattern)
  for (int i = 0; i < 100; i++) {
    ecgData[i] = 512 + 50 * sin(i * 0.1) + random(-10, 10);
  }
  
  // Simulate battery level (80-100%)
  batteryLevel = 90 + random(-10, 10);
  
  // Print sensor readings
  Serial.println("=== Simulated Sensor Readings ===");
  Serial.println("Heart Rate: " + String(heartRate) + " BPM");
  Serial.println("Temperature: " + String(temperature) + " °C");
  Serial.println("SpO2: " + String(spo2) + "%");
  Serial.println("Battery: " + String(batteryLevel) + "%");
  Serial.println("=================================");
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

/*
 * Installation Instructions:
 * 
 * 1. Install required libraries:
 *    - ArduinoJson by Benoit Blanchon (ONLY THIS ONE NEEDED!)
 * 
 * 2. Update configuration:
 *    - Change WiFi credentials
 *    - Update API base URL
 *    - Set unique device ID
 * 
 * 3. Upload code to ESP32
 * 
 * 4. Monitor serial output for debugging
 * 
 * This simplified version generates realistic vital signs data
 * without requiring external sensors, perfect for testing!
 */
