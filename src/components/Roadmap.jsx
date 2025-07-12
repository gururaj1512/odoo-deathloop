import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";

// Initialize mermaid
mermaid.initialize({ startOnLoad: false, theme: "default" });

const RoadmapGenerator = () => {
  const [input, setInput] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [loading, setLoading] = useState(false);
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

  // 🧼 Clean & extract diagram
  const extractMermaid = (text) => {
    if (!text) return "";
  
    // Step 1: Strip HTML tags
    const noHTML = text.replace(/<[^>]*>/g, "").trim();
  
    // Step 2: Extract code block if present
    const match = noHTML.match(/```mermaid\s*([\s\S]*?)```/);
    if (match) return match[1].trim();
  
    // Step 3: Fallback: extract everything starting from "graph"
    const graphIndex = noHTML.indexOf("graph");
    if (graphIndex !== -1) {
      const raw = noHTML.slice(graphIndex).trim();
  
      // remove trailing ```
      return raw.replace(/```$/, "").trim();
    }
  
    return "";
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
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
                {
                  text: `${systemPrompt}\n\nTopic: ${input}`,
                },
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
        if (diagramRef.current) {
          diagramRef.current.innerHTML =
            "<p>❌ No valid Mermaid diagram returned by Gemini.</p>";
        }
      }
    } catch (err) {
      console.error("❌ Error:", err);
      if (diagramRef.current) {
        diagramRef.current.innerHTML =
          "<p>❌ Error while contacting Gemini API.</p>";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mermaidCode || !diagramRef.current) return;

    const render = async () => {
      try {
        // Generate a unique ID for this diagram
        const diagramId = `diagram-${Date.now()}`;
        
        // Create a temporary div element with the mermaid class
        const tempDiv = document.createElement('div');
        tempDiv.className = 'mermaid';
        tempDiv.id = diagramId;
        tempDiv.textContent = mermaidCode;
        
        // Clear the container and append the temp div
        diagramRef.current.innerHTML = '';
        diagramRef.current.appendChild(tempDiv);
        
        // Render the diagram
        await mermaid.init(undefined, `#${diagramId}`);

        // Style the resulting SVG
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
        console.error("⚠️ Mermaid render error:", err);
        if (diagramRef.current)
          diagramRef.current.innerHTML =
            "<p>⚠️ Mermaid syntax error. Could not render diagram.</p>";
      }
    };

    render();
  }, [mermaidCode]);

  return (
    <div style={{ maxWidth: 800, margin: "auto", fontFamily: "sans-serif" }}>
      <h2>🛤️ AI-Powered Skill Roadmap Generator</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Cloud Engineer"
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />
      <button
        onClick={handleGenerate}
        style={{ marginTop: 10, padding: 10, fontSize: 16 }}
      >
        {loading ? "Generating..." : "Generate Roadmap"}
      </button>

      <div style={{ marginTop: 40, borderTop: "2px solid #000", paddingTop: 20 }}>
        <h3>📌 Roadmap Output</h3>
        <div
          ref={diagramRef}
          style={{
            minHeight: 200,
            border: "1px solid #000",
            background: "#fff",
            padding: 10,
          }}
        />
      </div>
    </div>
  );
};

export default RoadmapGenerator;