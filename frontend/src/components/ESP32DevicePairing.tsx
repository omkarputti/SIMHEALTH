import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  WifiOff, 
  Battery, 
  Zap, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Smartphone,
  Activity,
  Heart,
  Thermometer,
  Activity as SpO2Icon
} from "lucide-react";

interface ESP32Device {
  deviceId: string;
  deviceName: string;
  isActive: boolean;
  lastSeen: string;
  isOnline: boolean;
  batteryLevel: number | null;
}

interface DevicePairingProps {
  patientId: string;
  patientName: string;
}

const ESP32DevicePairing = ({ patientId, patientName }: DevicePairingProps) => {
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [isPairing, setIsPairing] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [pairedDevice, setPairedDevice] = useState<ESP32Device | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const pairDevice = async () => {
    if (!deviceId.trim()) {
      setPairingError("Please enter a device ID");
      return;
    }

    setIsPairing(true);
    setPairingError(null);

    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/esp32/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deviceId: deviceId.trim(),
          patientId: patientId,
          deviceName: deviceName.trim() || `ESP32-${deviceId.trim()}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to pair device');
      }

      const data = await response.json();
      
      // Create device object for display
      const device: ESP32Device = {
        deviceId: data.deviceId,
        deviceName: deviceName.trim() || `ESP32-${deviceId.trim()}`,
        isActive: true,
        lastSeen: new Date().toISOString(),
        isOnline: true,
        batteryLevel: null
      };

      setPairedDevice(device);
      setDeviceId("");
      setDeviceName("");
      
      // Check device status after pairing
      setTimeout(() => {
        checkDeviceStatus(data.deviceId);
      }, 2000);

    } catch (error: any) {
      setPairingError(error.message);
    } finally {
      setIsPairing(false);
    }
  };

  const checkDeviceStatus = async (deviceIdToCheck?: string) => {
    const targetDeviceId = deviceIdToCheck || pairedDevice?.deviceId;
    if (!targetDeviceId) return;

    setIsCheckingStatus(true);
    try {
      const token = localStorage.getItem('idToken');
      if (!token) return;

      const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/esp32/status/${targetDeviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPairedDevice(data.device);
      }
    } catch (error) {
      console.error('Error checking device status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const unpairDevice = () => {
    setPairedDevice(null);
    setPairingError(null);
  };

  // Auto-refresh device status every 30 seconds
  useEffect(() => {
    if (!pairedDevice) return;

    const interval = setInterval(() => {
      checkDeviceStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [pairedDevice]);

  return (
    <div className="space-y-6">
      {/* Device Pairing Section */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>ESP32 Device Pairing</span>
          </CardTitle>
          <CardDescription>
            Connect your ESP32 health monitoring device to start real-time vital signs tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pairedDevice ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceId">Device ID</Label>
                  <Input
                    id="deviceId"
                    placeholder="Enter ESP32 device ID"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Found on your ESP32 device or in the device documentation
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceName">Device Name (Optional)</Label>
                  <Input
                    id="deviceName"
                    placeholder="My Health Monitor"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                  />
                </div>
              </div>

              {pairingError && (
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">{pairingError}</span>
                </div>
              )}

              <Button 
                onClick={pairDevice} 
                disabled={isPairing || !deviceId.trim()}
                className="w-full"
              >
                {isPairing ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Pairing Device...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Pair ESP32 Device
                  </>
                )}
              </Button>

              {/* Instructions */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">How to pair your ESP32 device:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Power on your ESP32 health monitoring device</li>
                  <li>Note the device ID displayed on the device screen or in the serial monitor</li>
                  <li>Enter the device ID above and click "Pair ESP32 Device"</li>
                  <li>Once paired, your device will start sending vital signs data automatically</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Paired Device Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-900">Device Successfully Paired!</h3>
                    <p className="text-sm text-green-700">
                      {pairedDevice.deviceName} ({pairedDevice.deviceId})
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={unpairDevice}>
                  Unpair Device
                </Button>
              </div>

              {/* Device Status */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Connection Status</span>
                    {pairedDevice.isOnline ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <Badge className={pairedDevice.isOnline ? "bg-green-500" : "bg-red-500"}>
                    {pairedDevice.isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Battery Level</span>
                    <Battery className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-lg font-bold">
                    {pairedDevice.batteryLevel ? `${pairedDevice.batteryLevel}%` : "Unknown"}
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Last Seen</span>
                    <Activity className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm">
                    {new Date(pairedDevice.lastSeen).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Refresh Button */}
              <Button 
                variant="outline" 
                onClick={() => checkDeviceStatus()}
                disabled={isCheckingStatus}
                className="w-full"
              >
                {isCheckingStatus ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Checking Status...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Refresh Device Status
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vital Signs Monitoring Preview */}
      {pairedDevice && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Real-time Vital Signs</span>
            </CardTitle>
            <CardDescription>
              Your ESP32 device is now monitoring your vital signs. Doctors can view this data in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-border text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <h3 className="font-semibold">Heart Rate</h3>
                <p className="text-sm text-muted-foreground">Real-time monitoring</p>
              </div>
              <div className="p-4 rounded-lg border border-border text-center">
                <Thermometer className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <h3 className="font-semibold">Temperature</h3>
                <p className="text-sm text-muted-foreground">Continuous tracking</p>
              </div>
              <div className="p-4 rounded-lg border border-border text-center">
                <SpO2Icon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold">SpO₂</h3>
                <p className="text-sm text-muted-foreground">Oxygen saturation</p>
              </div>
              <div className="p-4 rounded-lg border border-border text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold">ECG</h3>
                <p className="text-sm text-muted-foreground">Heart rhythm analysis</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Important:</p>
                  <p>
                    Your vital signs data is automatically shared with your assigned doctors. 
                    In case of emergency or abnormal readings, your doctor will be notified immediately.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ESP32DevicePairing;
