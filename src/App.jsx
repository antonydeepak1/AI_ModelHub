import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import GenAI from './pages/GenAI';
import Nlp from './pages/Nlp'; // ⬅️ renamed for clarity
import MedicalFileProcessor from './genai/medical'; // ⬅️ renamed for clarity
import AIFrontend from './genai/codegen';
import ComedyGeneratorEnhanced from './nlp/comdey';          // ⬅️ renamed for clarity

const App = () => (
  <Router>
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/genai" element={<GenAI />} />
        <Route path="/nlp" element={<Nlp />} /> {/* ⬅️ renamed for clarity */}
        {/* The following routes are now under GenAI */}
        <Route path="/medical" element={<MedicalFileProcessor />} />
        <Route path="/codegen" element={<AIFrontend />} />
        <Route path="/comedy-nlp" element={<ComedyGeneratorEnhanced />} /> {/* ⬅️ renamed for clarity */}
      </Routes>
    </div>
  </Router>
);

export default App;
