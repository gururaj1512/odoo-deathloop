import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const hardcodedSkillData = {
  'react': {
    summary: 'React is a popular JavaScript library for building user interfaces, especially single-page applications. It uses a component-based architecture and a virtual DOM for efficient rendering.',
    roadmap: [
      'Learn JavaScript ES6+',
      'Understand JSX & Components',
      'State & Props',
      'Hooks (useState, useEffect, etc.)',
      'React Router',
      'State Management (Redux, Context)',
      'Testing (Jest, React Testing Library)',
      'Performance Optimization',
      'Deploying React Apps',
    ],
    recommendations: [
      'Learn TypeScript for type safety',
      'Explore Next.js for SSR',
      'Follow React 18+ updates',
      'Practice building real-world projects',
    ],
    icon: <AutoAwesomeIcon fontSize="large" className="text-blue-500" />,
    color: 'from-blue-400 to-blue-600',
  },
  'python': {
    summary: 'Python is a versatile, high-level programming language known for its readability and broad application in web development, data science, AI, and automation.',
    roadmap: [
      'Learn Python syntax & basics',
      'Data structures & OOP',
      'Popular libraries (requests, pandas, numpy)',
      'Web frameworks (Flask, Django)',
      'Data Science & ML (scikit-learn, TensorFlow)',
      'Testing & Automation',
      'Best practices & code style',
    ],
    recommendations: [
      'Explore AI/ML with Python',
      'Contribute to open source',
      'Learn about async programming',
    ],
    icon: <EmojiObjectsIcon fontSize="large" className="text-yellow-500" />,
    color: 'from-yellow-300 to-yellow-500',
  },
  // Add more skills as needed
};

function getSkillData(skill) {
  const key = skill.toLowerCase();
  if (hardcodedSkillData[key]) return hardcodedSkillData[key];
  // Simulate Gemini API call (fallback)
  return {
    summary: `No hardcoded data found for "${skill}". (Simulated Gemini API) This skill is important in the modern tech landscape. Start with the basics, follow a structured roadmap, and stay updated with the latest trends!`,
    roadmap: [
      'Understand the fundamentals',
      'Explore core concepts',
      'Practice with projects',
      'Join communities & stay updated',
    ],
    recommendations: [
      'Look for online courses',
      'Follow industry leaders',
      'Experiment with real-world problems',
    ],
    icon: <TimelineIcon fontSize="large" className="text-purple-500" />,
    color: 'from-purple-400 to-purple-600',
  };
}

function SearchAiSkill() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult(getSkillData(query));
      setLoading(false);
    }, 800); // Simulate API delay
  };

  return (
    <motion.div
      className="w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mb-8 items-center justify-center">
        <TextField
          label="Search a Skill (e.g. React, Python)"
          variant="outlined"
          value={query}
          onChange={e => setQuery(e.target.value)}
          fullWidth
          size="medium"
          className="bg-white rounded-xl"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SearchIcon />}
          className="rounded-xl font-semibold shadow"
          disabled={!query || loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      {result && (
        <motion.div
          className={`w-full max-w-3xl bg-gradient-to-br ${result.color} text-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6 animate-fade-in`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-2">
            {result.icon}
            <h2 className="text-3xl font-bold">Skill Summary</h2>
          </div>
          <p className="text-lg font-medium mb-4">{result.summary}</p>
          <div>
            <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2"><TimelineIcon /> Roadmap</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              {result.roadmap.map((step, idx) => (
                <li key={idx} className="text-lg">{step}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2"><EmojiObjectsIcon /> Recommendations</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="text-lg">{rec}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default SearchAiSkill; 