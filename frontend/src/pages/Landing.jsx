import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Video, Users, ArrowRight, Camera, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">CrowdSense<span className="text-primary">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
          <Link to="/signup" className="text-sm font-medium bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-primary/25">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium text-primary-foreground/80">YOLOv8 Powered Real-Time Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
        >
          AI-Powered Crowd Intelligence <br className="hidden md:block" />
          for <span className="text-gradient">Safer Spaces</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
        >
          Monitor crowd density, generate real-time heatmaps, and receive smart alerts before critical mass is reached. Turn video feeds into actionable insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/signup" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-xl shadow-primary/25">
            Start Monitoring <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-8 py-4 rounded-full text-lg font-medium transition-all border border-border">
            <Video className="w-5 h-5" /> Live Demo
          </button>
        </motion.div>

        {/* Features preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Live Detection</h3>
            <p className="text-sm text-muted-foreground">Process multiple camera feeds in real-time with sub-millisecond latency.</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-400">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Alerts</h3>
            <p className="text-sm text-muted-foreground">Set custom capacity thresholds and receive instant notifications.</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 text-violet-400">
              <BarChart2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Deep Analytics</h3>
            <p className="text-sm text-muted-foreground">Historical data, peak hour analysis, and predictive density mapping.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
