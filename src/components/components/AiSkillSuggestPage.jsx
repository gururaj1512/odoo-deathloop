import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import TimelineIcon from '@mui/icons-material/Timeline';
import CircularProgress from '@mui/material/CircularProgress';
import ReactMarkdown from 'react-markdown';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import BugReportIcon from '@mui/icons-material/BugReport';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import FunctionsIcon from '@mui/icons-material/Functions';
import TerminalIcon from '@mui/icons-material/Terminal';
import JavascriptIcon from '@mui/icons-material/Javascript';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditNoteIcon from '@mui/icons-material/EditNote';

const skills = [
  { key: 'react', title: 'React', icon: <AutoAwesomeIcon className="text-blue-500" />, desc: 'Build modern web apps with React.' },
  { key: 'python', title: 'Python', icon: <EmojiObjectsIcon className="text-yellow-500" />, desc: 'Versatile language for AI, web, and more.' },
  { key: 'typescript', title: 'TypeScript', icon: <CodeIcon className="text-blue-700" />, desc: 'Typed superset of JavaScript for scalable apps.' },
  { key: 'nodejs', title: 'Node.js', icon: <TerminalIcon className="text-green-700" />, desc: 'JavaScript runtime for backend development.' },
  { key: 'devops', title: 'DevOps', icon: <SettingsSuggestIcon className="text-indigo-500" />, desc: 'CI/CD, automation, and cloud infrastructure.' },
  { key: 'data-science', title: 'Data Science', icon: <DataObjectIcon className="text-pink-500" />, desc: 'Extract insights from data using Python, R, ML.' },
  { key: 'ux-ui', title: 'UX/UI Design', icon: <DesignServicesIcon className="text-pink-400" />, desc: 'Design user experiences and interfaces.' },
  { key: 'mobile', title: 'Mobile Development', icon: <PhoneIphoneIcon className="text-purple-500" />, desc: 'Build apps for iOS and Android.' },
  { key: 'sql', title: 'SQL', icon: <StorageIcon className="text-blue-400" />, desc: 'Query and manage relational databases.' },
  { key: 'docker', title: 'Docker', icon: <DeveloperModeIcon className="text-blue-600" />, desc: 'Containerize and deploy applications.' },
  { key: 'kubernetes', title: 'Kubernetes', icon: <CloudQueueIcon className="text-blue-500" />, desc: 'Orchestrate containers at scale.' },
  { key: 'rust', title: 'Rust', icon: <IntegrationInstructionsIcon className="text-orange-700" />, desc: 'Safe and fast systems programming.' },
  { key: 'go', title: 'Go', icon: <FunctionsIcon className="text-cyan-600" />, desc: 'Efficient, concurrent backend development.' },
  { key: 'java', title: 'Java', icon: <CodeIcon className="text-red-700" />, desc: 'Enterprise-scale backend and Android apps.' },
  { key: 'cpp', title: 'C++', icon: <CodeIcon className="text-gray-700" />, desc: 'High-performance systems and game dev.' },
  { key: 'flutter', title: 'Flutter', icon: <PhoneIphoneIcon className="text-blue-400" />, desc: 'Cross-platform mobile apps with Dart.' },
  { key: 'aws', title: 'AWS', icon: <CloudQueueIcon className="text-yellow-500" />, desc: 'Cloud computing and infrastructure.' },
  { key: 'system-design', title: 'System Design', icon: <StorageRoundedIcon className="text-indigo-700" />, desc: 'Architect scalable, reliable systems.' },
  { key: 'prompt-engineering', title: 'Prompt Engineering', icon: <JavascriptIcon className="text-purple-700" />, desc: 'Craft effective prompts for LLMs.' },
  { key: 'mlops', title: 'MLOps', icon: <SettingsSuggestIcon className="text-green-500" />, desc: 'Deploy and manage ML models.' },
  { key: 'product-management', title: 'Product Management', icon: <ManageAccountsIcon className="text-blue-800" />, desc: 'Lead product strategy and execution.' },
  { key: 'qa', title: 'QA & Testing', icon: <BugReportIcon className="text-red-500" />, desc: 'Ensure software quality and reliability.' },
  { key: 'tech-writing', title: 'Technical Writing', icon: <EditNoteIcon className="text-gray-500" />, desc: 'Document and explain technical concepts.' },
  { key: 'ai', title: 'AI & ML', icon: <TrendingUpIcon className="text-purple-500" />, desc: 'Artificial Intelligence and Machine Learning.' },
  { key: 'blockchain', title: 'Blockchain', icon: <TimelineIcon className="text-green-500" />, desc: 'Decentralized apps and smart contracts.' },
  { key: 'cloud', title: 'Cloud', icon: <EmojiObjectsIcon className="text-blue-400" />, desc: 'AWS, Azure, GCP, and cloud skills.' },
  { key: 'cybersecurity', title: 'Cybersecurity', icon: <TimelineIcon className="text-red-500" />, desc: 'Protect systems and data.' },
];

const fallbackRoadmaps = {
  react: `## React Roadmap\n\n1. Learn JavaScript ES6+\n2. Understand JSX & Components\n3. State & Props\n4. Hooks (useState, useEffect, etc.)\n5. React Router\n6. State Management (Redux, Context)\n7. Testing (Jest, React Testing Library)\n8. Performance Optimization\n9. Deploying React Apps`,
  python: `## Python Roadmap\n\n1. Learn Python syntax & basics\n2. Data structures & OOP\n3. Popular libraries (requests, pandas, numpy)\n4. Web frameworks (Flask, Django)\n5. Data Science & ML (scikit-learn, TensorFlow)\n6. Testing & Automation\n7. Best practices & code style`,
  ai: `## AI & ML Roadmap\n\n1. Math & Statistics\n2. Python for AI\n3. Data Preprocessing\n4. Machine Learning Algorithms\n5. Deep Learning\n6. Model Deployment\n7. Stay updated with AI trends`,
  blockchain: `## Blockchain Roadmap\n\n1. Understand Blockchain Basics\n2. Learn Smart Contracts\n3. Ethereum & Solidity\n4. DApps Development\n5. Security Best Practices\n6. Explore DeFi & NFTs`,
  cloud: `## Cloud Roadmap\n\n1. Cloud Fundamentals\n2. AWS, Azure, GCP Basics\n3. Compute, Storage, Networking\n4. DevOps & CI/CD\n5. Security & Monitoring\n6. Cloud Native Apps`,
  cybersecurity: `## Cybersecurity Roadmap\n\n1. Security Fundamentals\n2. Network Security\n3. Application Security\n4. Cryptography\n5. Threat Modeling\n6. Incident Response\n7. Stay updated with new threats`,
};

function AiSkillSuggestPage() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchGeminiRoadmap(skill) {
    setLoading(true);
    setError(null);
    setRoadmap(null);
    try {
      // Dynamically import the SDK only on client
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: 'AIzaSyCSOlIJHAxG_hfZPU10tKtB0XffRa9fGm8' });
      const prompt = `Give a detailed skill summary and roadmap for learning ${skill.title} as a modern tech skill. Include current and future trends, and actionable steps. Format the response in markdown with headings, lists, and bold where appropriate.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      // Try to get markdown text from response
      let text = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text || text.trim().toLowerCase().includes('no roadmap')) {
        text = fallbackRoadmaps[skill.key] || 'No roadmap found.';
      }
      setRoadmap(text);
    } catch (err) {
      setError('Failed to fetch roadmap from Gemini. Showing a sample roadmap.');
      setRoadmap(fallbackRoadmaps[skill.key] || 'No roadmap found.');
    }
    setLoading(false);
  }

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    fetchGeminiRoadmap(skill);
  };

  const filteredSkills = skills.filter(skill =>
    skill.title.toLowerCase().includes(search.toLowerCase()) ||
    skill.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-orange-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-white/80 border-r border-gray-200 p-6 flex flex-col gap-4 shadow-xl z-10">
        <div className="flex items-center gap-2 mb-4">
          <SearchIcon className="text-blue-500" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {filteredSkills.map(skill => (
            <motion.button
              key={skill.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSkillSelect(skill)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 ${selectedSkill?.key === skill.key ? 'ring-2 ring-blue-400 bg-blue-100' : ''}`}
            >
              {skill.icon}
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg text-gray-800">{skill.title}</span>
                <span className="text-gray-500 text-sm">{skill.desc}</span>
              </div>
            </motion.button>
          ))}
        </div>
        <div className="mt-8 text-xs text-gray-400 text-center">Powered by Gemini AI</div>
      </aside>
      <main className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto">
        {!selectedSkill && (
          <motion.div
            className="w-full max-w-2xl text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 tracking-tight">Explore Skills & Roadmaps</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">Select a skill from the left to view a detailed AI-generated summary, roadmap, and trends. Stay ahead in your learning journey!</p>
            <img src="public\roadmap.webp" alt="Roadmap Banner" className="mx-auto w-full" />
          </motion.div>
        )}
        {selectedSkill && (
          <motion.div
            className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 animate-fade-in mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-2">
              {selectedSkill.icon}
              <h2 className="text-3xl font-bold text-blue-700">{selectedSkill.title} Roadmap</h2>
            </div>
            <p className="text-gray-600 text-lg mb-2">{selectedSkill.desc}</p>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <CircularProgress color="primary" />
              </div>
            ) : (
              <div className="prose max-w-none text-gray-800 whitespace-pre-line text-base md:text-lg">
                {error && <div className="text-red-500 font-semibold mb-2">{error}</div>}
                <ReactMarkdown>{roadmap}</ReactMarkdown>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default AiSkillSuggestPage; 