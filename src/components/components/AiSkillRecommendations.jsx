import React from 'react';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import TimelineIcon from '@mui/icons-material/Timeline';

const recommendations = [
  {
    title: 'AI & Machine Learning',
    description: 'AI is transforming every industry. Skills in ML, deep learning, and prompt engineering are in high demand.',
    icon: <AutoAwesomeIcon fontSize="large" className="text-purple-500" />, 
    color: 'from-purple-400 to-purple-600',
    trend: 'Future',
  },
  {
    title: 'Web3 & Blockchain',
    description: 'Decentralized apps, smart contracts, and blockchain development are shaping the future of the web.',
    icon: <TrendingUpIcon fontSize="large" className="text-blue-500" />, 
    color: 'from-blue-400 to-blue-600',
    trend: 'Future',
  },
  {
    title: 'Cloud Computing',
    description: 'Cloud skills (AWS, Azure, GCP) are essential for scalable, modern applications and infrastructure.',
    icon: <EmojiObjectsIcon fontSize="large" className="text-yellow-500" />, 
    color: 'from-yellow-300 to-yellow-500',
    trend: 'Current',
  },
  {
    title: 'Cybersecurity',
    description: 'With increasing digital threats, cybersecurity expertise is more important than ever.',
    icon: <TimelineIcon fontSize="large" className="text-green-500" />, 
    color: 'from-green-400 to-green-600',
    trend: 'Current',
  },
  // Add more recommendations as needed
];

function AiSkillRecommendations() {
  return (
    <motion.div
      className="w-full bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl shadow-xl p-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-8 tracking-tight">Recommended Skills & Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            className={`bg-gradient-to-br ${rec.color} text-white rounded-2xl shadow-2xl p-8 flex flex-col gap-4 animate-fade-in`}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="flex items-center gap-4 mb-2">
              {rec.icon}
              <h3 className="text-2xl font-bold">{rec.title}</h3>
            </div>
            <p className="text-lg font-medium mb-2">{rec.description}</p>
            <span className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-semibold tracking-wide uppercase mt-auto">{rec.trend} Trend</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default AiSkillRecommendations; 