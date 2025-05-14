import React from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-zinc-900 flex flex-col items-center justify-center px-6 py-12 font-urbanist text-center">
      <div className="mb-10">
        <div className="flex justify-center items-center gap-3 mb-2">
          <Bot className="w-6 h-6 text-primary" />
          <span className="text-sm uppercase tracking-wide font-semibold text-primary">AI Model Hub</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black via-purple-700 to-indigo-400 mb-4 transition-all duration-300 hover:from-gray-800 hover:to-purple-500">
          Welcome to the AI Model Hub
        </h1>

        <p className="text-gray-700 dark:text-gray-300 text-lg max-w-xl mx-auto">
          Explore futuristic AI models crafted for coding, simplification, and more.
        </p>
      </div>

      {/* Card Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gen AI Card */}
        <Link to="/genai" className="group">
          <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl px-8 py-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black via-indigo-500 to-purple-400 group-hover:from-zinc-900 group-hover:to-fuchsia-500">
              🧠 Gen AI
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Explore Medical & Codegen AI models</p>
          </div>
        </Link>

        {/* NLP AI Card */}
        <Link to="/nlp" className="group">
          <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl px-8 py-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black via-green-500 to-teal-400 group-hover:from-zinc-900 group-hover:to-emerald-400">
              💬 NLP AI
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Run entity extraction, sentiment & summarization</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
