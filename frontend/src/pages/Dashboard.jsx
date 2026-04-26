import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Activity, AlertTriangle, Settings, LogOut, Bell, 
  Menu, Video as VideoIcon, Map, BarChart2 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ count: 0, density: 0, alert: false });
  const [chartData, setChartData] = useState([]);
  const [processedImage, setProcessedImage] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Setup WebSocket and webcam
  useEffect(() => {
    // 1. Get webcam stream
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };
    
    setupCamera();

    // 2. Setup WebSocket connection
    const socket = new WebSocket('ws://localhost:8000/ws/video-stream');
    
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setWs(socket);
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setProcessedImage(data.image);
        setStats({ count: data.count, density: data.density, alert: data.alert });
        
        // Update chart data (keep last 20 points)
        setChartData(prev => {
          const now = new Date();
          const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
          const newPoint = { time: timeStr, count: data.count };
          const newData = [...prev, newPoint];
          if (newData.length > 20) newData.shift();
          return newData;
        });
        
      } catch (e) {
        console.error("Error parsing websocket message", e);
      }
    };
    
    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    };

    return () => {
      socket.close();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Send frames to backend periodically
  useEffect(() => {
    if (!ws || !isConnected) return;
    
    const intervalId = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get base64 representation (JPEG for smaller size)
        const frameData = canvas.toDataURL('image/jpeg', 0.6);
        
        // Send to backend
        ws.send(frameData);
      }
    }, 200); // 5 FPS to reduce load on local machine
    
    return () => clearInterval(intervalId);
  }, [ws, isConnected]);

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="glass border-r border-border h-screen sticky top-0 flex flex-col z-20"
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">CrowdSense</span>
            </div>
          ) : (
            <Activity className="w-6 h-6 text-primary mx-auto" />
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<VideoIcon />} label="Live Monitoring" active={activeTab === 'live'} onClick={() => setActiveTab('live')} isSidebarOpen={isSidebarOpen} />
          <NavItem icon={<BarChart2 />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} isSidebarOpen={isSidebarOpen} />
          <NavItem icon={<Map />} label="Heatmaps" active={activeTab === 'heatmaps'} onClick={() => setActiveTab('heatmaps')} isSidebarOpen={isSidebarOpen} />
          <NavItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} isSidebarOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 text-muted-foreground hover:text-red-400 w-full transition-colors">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="glass border-b border-border h-16 flex items-center justify-between px-6 shrink-0 z-10">
          <h1 className="text-xl font-semibold capitalize">{activeTab.replace('-', ' ')}</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-sm font-medium text-muted-foreground">
                {isConnected ? 'System Online' : 'Connecting...'}
              </span>
            </div>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              {stats.alert && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white font-medium shadow-lg">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricCard 
              title="Total People" 
              value={stats.count} 
              trend="Live Detection" 
              icon={<Users className="w-6 h-6 text-blue-400" />}
              status="normal"
            />
            <MetricCard 
              title="Density Level" 
              value={Math.round(stats.density * 100) + "%"} 
              trend="Capacity" 
              icon={<Activity className="w-6 h-6 text-yellow-400" />}
              status={stats.density > 0.8 ? "danger" : stats.density > 0.5 ? "warning" : "normal"}
            />
            <MetricCard 
              title="Alerts Status" 
              value={stats.alert ? "1 Active Alert" : "All Clear"} 
              trend={stats.alert ? "High density detected" : "Normal operation"} 
              icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
              status={stats.alert ? "danger" : "normal"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card overflow-hidden flex flex-col h-[500px]">
                <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-slate-900/50">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Camera 1 - Main Entrance
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded border border-primary/30">AI Active</span>
                </div>
                <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                  
                  {/* Hidden raw video and canvas for capturing */}
                  <video ref={videoRef} autoPlay playsInline muted className="hidden" />
                  <canvas ref={canvasRef} width={640} height={480} className="hidden" />

                  {/* Display Processed Video from Backend */}
                  {processedImage ? (
                    <img 
                      src={processedImage} 
                      alt="Processed feed" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center">
                      <VideoIcon className="w-12 h-12 mb-2 opacity-50" />
                      <p>{isConnected ? 'Waiting for AI processing...' : 'Connecting to AI Engine...'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Analytics Chart Preview */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 text-foreground/90">Crowd Trend (Live)</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.length > 0 ? chartData : [{time: '0', count: 0}]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                      <Line 
                        type="stepAfter" 
                        dataKey="count" 
                        stroke="#8b5cf6" 
                        strokeWidth={3} 
                        dot={false}
                        isAnimationActive={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Panel - Alerts & Logs */}
            <div className="space-y-6">
              <div className="glass-card p-6 h-[500px] flex flex-col">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Live Alerts
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {stats.alert && (
                    <AlertItem 
                      time="Just now" 
                      message={`Density threshold exceeded (${stats.count} people)`} 
                      type="danger" 
                    />
                  )}
                  {stats.density > 0.5 && !stats.alert && (
                    <AlertItem 
                      time="Just now" 
                      message={`Crowd growing - Capacity at ${Math.round(stats.density*100)}%`} 
                      type="warning" 
                    />
                  )}
                  <AlertItem 
                    time="System" 
                    message="AI models loaded and stream active" 
                    type="info" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, isSidebarOpen }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
      active 
        ? 'bg-primary/20 text-primary font-medium border border-primary/30' 
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`}
  >
    {icon}
    {isSidebarOpen && <span>{label}</span>}
  </button>
);

const MetricCard = ({ title, value, trend, icon, status }) => {
  const statusColors = {
    normal: 'border-blue-500/30 bg-blue-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    danger: 'border-red-500/30 bg-red-500/5'
  };

  return (
    <div className={`glass-card p-6 border-t-2 ${statusColors[status]} transition-colors duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h2 className="text-3xl font-bold text-foreground">{value}</h2>
        </div>
        <div className="p-2 bg-secondary rounded-lg">
          {icon}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-4">{trend}</p>
    </div>
  );
};

const AlertItem = ({ time, message, type }) => {
  const colors = {
    danger: 'border-red-500/50 bg-red-500/10 text-red-200',
    warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-200',
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-200'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-3 rounded-lg border text-sm ${colors[type]}`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-medium opacity-80">{type.toUpperCase()}</span>
        <span className="text-xs opacity-60">{time}</span>
      </div>
      <p>{message}</p>
    </motion.div>
  );
};

export default Dashboard;
