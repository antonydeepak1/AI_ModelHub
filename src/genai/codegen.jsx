import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bot, Terminal } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const frameworks = ["Gradio", "Stremlit", "FastAPI", "Flask"];

const AIFrontend = () => {
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("Gradio");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/codegen/generate`, {
        prompt,
        framework,
      });
      setResponses((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to generate code", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full font-urbanist">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <motion.div
          className="w-16 h-16 bg-gradient-to-r from-black to-gray-800 text-white flex items-center justify-center rounded-full shadow-md mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Bot className="w-7 h-7" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-black">
          AI Code Assistant
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">
          Generate code from your ideas in your favorite framework
        </p>
      </div>

      {/* Input Section */}
      <div className="max-w-xl mx-auto space-y-6">
        {/* Prompt Input */}
        <div className="relative group">
          <textarea
            id="prompt"
            rows="4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 pt-6 pb-3 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder=" "
          />
          <label
            htmlFor="prompt"
            className="absolute left-4 top-2 text-sm text-gray-500 transition-all group-focus-within:top-1 group-focus-within:text-xs group-focus-within:text-black"
          >
            💡 Describe what you want to build
          </label>
        </div>

        {/* Framework Dropdown */}
        <div className="relative">
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-black dark:text-white focus:ring-2 focus:ring-black"
          >
            <option disabled>Select framework</option>
            {frameworks.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-3 pointer-events-none text-gray-500">▼</div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="relative w-full py-3 px-6 text-lg font-bold text-white rounded-full bg-gradient-to-r from-black via-gray-800 to-black hover:from-gray-700 hover:to-black shadow"
        >
          <span className="relative z-10">
            {loading ? "⏳ Generating..." : `⚡ Generate ${framework}`}
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300 rounded-full blur-sm" />
        </button>
      </div>

      {/* Output Section */}
      {responses.length > 0 && (
        <motion.div className="mt-10 space-y-8">
          <motion.div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
            {["Prompt", "Framework", "Response"].map((step, idx) => (
              <motion.div
                key={step}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
              >
                <div className="rounded-full p-2 bg-black text-white shadow">
                  <Terminal className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-black dark:text-white">{step}</span>
                {idx < 2 && <div className="w-4 h-px bg-black mx-2" />}
              </motion.div>
            ))}
          </motion.div>

          {/* Horizontal Scrollable Cards */}
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-4 min-w-full">
              {responses.map((resp, idx) => (
                <motion.div
                  key={idx}
                  className="flex-shrink-0 w-[300px] md:w-[400px] p-4 rounded-xl border-l-4 border-black bg-white dark:bg-zinc-800"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <h3 className="font-semibold mb-2 flex items-center text-black dark:text-white">
                    <Terminal className="h-4 w-4 mr-2" />
                    {resp.framework} Code
                  </h3>
                  <div className="group relative cursor-pointer min-h-[80px]">
                    <pre className="text-xs whitespace-pre-wrap text-gray-800 dark:text-white group-hover:opacity-0 transition-opacity duration-300 max-h-[250px] overflow-auto">
                      {resp.code}
                    </pre>
                    <p className="absolute top-0 left-0 w-full text-xs text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Hover to see code response more clearly
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIFrontend;
