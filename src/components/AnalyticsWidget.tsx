import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton } from '@mui/material';
import { Terminal, Code, DataObject, Psychology } from '@mui/icons-material';
import CountUp from 'react-countup';
import './cyberpunk-styles.css'; // Custom CSS for glitch effects

// Define props interface
interface StatRowProps {
  icon: ReactNode;
  label: string;
  value: number;
  suffix?: string;
}
export const CyberStatsWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hackInitiated, setHackInitiated] = useState(false);

  // Stats data
  const stats = {
    years: 1,
    projects: 6,
    skills: 25,
    uptime: '99.9%' // Fun geeky metric
  };

  // Trigger "hacking" animation
  const initiateHack = () => {
    setHackInitiated(true);
    setTimeout(() => setHackInitiated(false), 1500);
  };

  return (
    <div className="cyberpunk-terminal">
      {/* Closed State (Easter Egg) */}
      {!isExpanded && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(true)}
          className="terminal-icon"
        >
          <Terminal sx={{ color: '#00ffc3', fontSize: 36 }} />
          <div className="pulse-dot"></div>
        </motion.div>
      )}

      {/* Expanded State */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: hackInitiated 
                ? '0 0 20px #ff00ff, 0 0 30px #00ffc3' 
                : '0 0 10px #00ffc3'
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`terminal-window ${hackInitiated ? 'glitch' : ''}`}
          >
            {/* Header */}
            <div className="terminal-header">
              <Typography 
                variant="h6" 
                className="cyber-text"
                sx={{ textShadow: '0 0 5px #00ffc3' }}
              >
                {'>'} SYSTEM_STATS.EXE
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setIsExpanded(false)}
                className="close-button"
              >
                <span className="cyber-text">[X]</span>
              </IconButton>
            </div>

            {/* Content */}
            <div className="terminal-body">
              <StatRow 
                icon={<Code />} 
                label="CODE_YEARS" 
                value={stats.years} 
                suffix="+"
              />
              <StatRow 
                icon={<DataObject />} 
                label="ACTIVE_PROJECTS" 
                value={stats.projects} 
              />
              <StatRow 
                icon={<Psychology />} 
                label="SKILL_NODES" 
                value={stats.skills} 
              />
              <div className="status-bar">
                <span className="blink">_</span> SYSTEM_UPTIME: {stats.uptime}
              </div>
            </div>

            {/* Hacker Button */}
            <button 
              onClick={initiateHack}
              className="hack-button cyber-text"
            >
              INITIATE_DEEP_SCAN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Animated Stat Component
const StatRow = ({ icon, label, value, suffix = '' }: StatRowProps)  => (
  <div className="stat-row">
    <span className="stat-icon">{icon}</span>
    <span className="stat-label cyber-text">{label}:</span>
    <CountUp
      end={value}
      duration={2}
      className="stat-value cyber-text"
      suffix={suffix}
    />
  </div>
);