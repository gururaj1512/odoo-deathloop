import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import { motion, AnimatePresence } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircularProgress from '@mui/material/CircularProgress';

mermaid.initialize({ startOnLoad: false, theme: "default" });

const RoadmapGenerator = () => {
  const [input, setInput] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const diagramRef = useRef(null);

  const API_KEY = "AIzaSyCCkWNEqHT65sIgjGb4m2SKHih4zOl-KZ8";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const systemPrompt = `You are a roadmap generator. ONLY return a valid Mermaid diagram inside a markdown code block like:
\`\`\`mermaid
graph TD
  Start --> LearnBasics
  LearnBasics --> ChooseSpecialization
\`\`\`
Do NOT include explanation. Strictly return the diagram.`;

  const extractMermaid = (text) => {
    if (!text) return "";
    const noHTML = text.replace(/<[^>]*>/g, "").trim();
    const match = noHTML.match(/```mermaid\s*([\s\S]*?)```/);
    if (match) return match[1].trim();
    const graphIndex = noHTML.indexOf("graph");
    if (graphIndex !== -1) {
      const raw = noHTML.slice(graphIndex).trim();
      return raw.replace(/```$/, "").trim();
    }
    return "";
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setMermaidCode("");
    if (diagramRef.current) diagramRef.current.innerHTML = "";
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\nTopic: ${input}` },
              ],
            },
          ],
        }),
      });
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const diagramText = extractMermaid(rawText);
      if (diagramText && diagramText.startsWith("graph")) {
        setMermaidCode(diagramText);
      } else {
        setError("❌ No valid Mermaid diagram returned by Gemini.");
      }
    } catch (err) {
      setError("❌ Error while contacting Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mermaidCode || !diagramRef.current) return;
    const render = async () => {
      try {
        const diagramId = `diagram-${Date.now()}`;
        const tempDiv = document.createElement('div');
        tempDiv.className = 'mermaid';
        tempDiv.id = diagramId;
        tempDiv.textContent = mermaidCode;
        diagramRef.current.innerHTML = '';
        diagramRef.current.appendChild(tempDiv);
        await mermaid.init(undefined, `#${diagramId}`);
        const svg = diagramRef.current.querySelector("svg");
        if (svg) {
          svg.style.background = "#fff";
          svg.style.color = "black";
          svg.querySelectorAll("*").forEach((el) => {
            el.setAttribute("stroke", "black");
            el.setAttribute("fill", "black");
          });
        }
      } catch (err) {
        setError("⚠️ Mermaid syntax error. Could not render diagram.");
      }
    };
    render();
  }, [mermaidCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-orange-50 flex flex-col items-center py-10 px-2">
      <motion.div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center mb-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <AutoAwesomeIcon className="text-blue-600" fontSize="large" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-tight">AI-Powered Roadmap Generator</h1>
        </div>
        <p className="text-lg text-center text-gray-600 mb-6 max-w-2xl">Generate a visual skill roadmap for any topic using AI and Mermaid.js. Enter a skill or career path below and get a custom roadmap!</p>
        <div className="w-full flex flex-col md:flex-row gap-4 items-center mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Cloud Engineer"
            className="flex-1 px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-blue-50 shadow"
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow transition-all"
            disabled={loading || !input.trim()}
          >
            {loading ? <span className="flex items-center gap-2"><CircularProgress size={22} color="inherit" /> Generating...</span> : 'Generate Roadmap'}
          </button>
        </div>
        <AnimatePresence>
          {(mermaidCode || error) && (
            <motion.div
              className="w-full bg-white rounded-2xl shadow-lg p-6 mt-6 flex flex-col items-center border border-blue-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">📌 Roadmap Output</h3>
              {error && <div className="text-red-500 font-semibold mb-4">{error}</div>}
              <div
                ref={diagramRef}
                className="w-full overflow-x-auto flex justify-center items-center min-h-[220px]"
                style={{ background: '#fff' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RoadmapGenerator;