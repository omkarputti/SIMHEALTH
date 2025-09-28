import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Zap, 
  Battery, 
  Wifi, 
  WifiOff,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface VitalSignsData {
  id: string;
  deviceId: string;
  patientId: string;
  timestamp: string;
  heartRate: number | null;
  temperature: number | null;
  spo2: number | null;
  ecgData: number[] | null;
  bloodPressure: { systolic: number; diastolic: number } | null;
  respiratoryRate: number | null;
  batteryLevel: number | null;
}

interface DeviceStatus {
  deviceId: string;
  patientId: string;
  deviceName: string;
  isActive: boolean;
  lastSeen: string;
  isOnline: boolean;
  batteryLevel: number | null;
}

interface VitalSignsMonitorProps {
  patientId: string;
  patientName: string;
}

const VitalSignsMonitor = ({ patientId, patientName }: VitalSignsMonitorProps) => {
  const [latestVitals, setLatestVitals] = useState<VitalSignsData | null>(null);
  const [vitalsHistory, setVitalsHistory] = useState<VitalSignsData[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestVitals = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/vitals/${patientId}/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch latest vitals');
      }

      const data = await response.json();
      setLatestVitals(data.latestVitals);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchVitalsHistory = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) return;

      const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/vitals/${patientId}?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vitals history');
      }

      const data = await response.json();
      setVitalsHistory(data.vitals);
    } catch (err: any) {
      console.error('Error fetching vitals history:', err);
    }
  };

  const fetchDeviceStatus = async () => {
    if (!latestVitals?.deviceId) return;

    try {
      const token = localStorage.getItem('idToken');
      if (!token) return;

      const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/esp32/status/${latestVitals.deviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch device status');
      }

      const data = await response.json();
      setDeviceStatus(data.device);
    } catch (err: any) {
      console.error('Error fetching device status:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchLatestVitals(),
        fetchVitalsHistory()
      ]);
      setLoading(false);
    };

    loadData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchLatestVitals();
      fetchDeviceStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [patientId]);

  useEffect(() => {
    if (latestVitals?.deviceId) {
      fetchDeviceStatus();
    }
  }, [latestVitals?.deviceId]);

  const getVitalStatus = (value: number | null, normalRange: [number, number], criticalRange: [number, number]) => {
    if (value === null) return 'unknown';
    if (value < criticalRange[0] || value > criticalRange[1]) return 'critical';
    if (value < normalRange[0] || value > normalRange[1]) return 'warning';
    return 'normal';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'normal': return <TrendingUp className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className="medical-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 animate-pulse text-primary" />
              <p className="text-muted-foreground">Loading vital signs...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="medical-card">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestVitals) {
    return (
      <Card className="medical-card">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p>No vital signs data available for {patientName}</p>
            <p className="text-sm">ESP32 device may not be connected or registered</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const heartRateStatus = getVitalStatus(latestVitals.heartRate, [60, 100], [40, 150]);
  const temperatureStatus = getVitalStatus(latestVitals.temperature, [36.1, 37.2], [35, 40]);
  const spo2Status = getVitalStatus(latestVitals.spo2, [95, 100], [90, 100]);
  const bpStatus = latestVitals.bloodPressure ? 
    getVitalStatus(latestVitals.bloodPressure.systolic, [90, 120], [70, 180]) : 'unknown';

  // Prepare chart data
  const chartData = vitalsHistory.slice(0, 20).reverse().map((vital, index) => ({
    time: new Date(vital.timestamp).toLocaleTimeString(),
    heartRate: vital.heartRate,
    temperature: vital.temperature,
    spo2: vital.spo2,
    systolic: vital.bloodPressure?.systolic,
    diastolic: vital.bloodPressure?.diastolic
  }));

  return (
    <div className="space-y-6">
      {/* Device Status */}
      {deviceStatus && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>ESP32 Device Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                {deviceStatus.isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  {deviceStatus.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Battery className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  {deviceStatus.batteryLevel ? `${deviceStatus.batteryLevel}%` : 'Unknown'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last seen: {new Date(deviceStatus.lastSeen).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Device: {deviceStatus.deviceName}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Vital Signs */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Current Vital Signs</span>
          </CardTitle>
          <CardDescription>
            Real-time monitoring for {patientName} • Last updated: {new Date(latestVitals.timestamp).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Heart Rate */}
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <Heart className="h-5 w-5 text-red-500" />
                {getStatusIcon(heartRateStatus)}
              </div>
              <h3 className="font-semibold">Heart Rate</h3>
              <p className="text-2xl font-bold">
                {latestVitals.heartRate ? `${latestVitals.heartRate} BPM` : 'N/A'}
              </p>
              <Badge className={`mt-2 ${getStatusColor(heartRateStatus)} text-white`}>
                {heartRateStatus}
              </Badge>
            </div>

            {/* Temperature */}
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <Thermometer className="h-5 w-5 text-orange-500" />
                {getStatusIcon(temperatureStatus)}
              </div>
              <h3 className="font-semibold">Temperature</h3>
              <p className="text-2xl font-bold">
                {latestVitals.temperature ? `${latestVitals.temperature}°C` : 'N/A'}
              </p>
              <Badge className={`mt-2 ${getStatusColor(temperatureStatus)} text-white`}>
                {temperatureStatus}
              </Badge>
            </div>

            {/* SpO2 */}
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-blue-500" />
                {getStatusIcon(spo2Status)}
              </div>
              <h3 className="font-semibold">SpO₂</h3>
              <p className="text-2xl font-bold">
                {latestVitals.spo2 ? `${latestVitals.spo2}%` : 'N/A'}
              </p>
              <Badge className={`mt-2 ${getStatusColor(spo2Status)} text-white`}>
                {spo2Status}
              </Badge>
            </div>

            {/* Blood Pressure */}
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                {getStatusIcon(bpStatus)}
              </div>
              <h3 className="font-semibold">Blood Pressure</h3>
              <p className="text-2xl font-bold">
                {latestVitals.bloodPressure ? 
                  `${latestVitals.bloodPressure.systolic}/${latestVitals.bloodPressure.diastolic}` : 
                  'N/A'
                }
              </p>
              <Badge className={`mt-2 ${getStatusColor(bpStatus)} text-white`}>
                {bpStatus}
              </Badge>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Respiratory Rate</h3>
              <p className="text-xl font-bold">
                {latestVitals.respiratoryRate ? `${latestVitals.respiratoryRate} breaths/min` : 'N/A'}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Battery Level</h3>
              <p className="text-xl font-bold">
                {latestVitals.batteryLevel ? `${latestVitals.batteryLevel}%` : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs Trends */}
      {chartData.length > 0 && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Vital Signs Trends</CardTitle>
            <CardDescription>Recent vital signs data over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Heart Rate (BPM)"
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="spo2" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="SpO₂ (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Systolic BP"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ECG Data Visualization */}
      {latestVitals.ecgData && latestVitals.ecgData.length > 0 && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>ECG Waveform</CardTitle>
            <CardDescription>Real-time electrocardiogram data</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={latestVitals.ecgData.map((value, index) => ({ time: index, value }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#059669" 
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VitalSignsMonitor;
