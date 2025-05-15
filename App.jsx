// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AudioDenoiser from './audio/audiomouli';

const Home = () => (
  <div className="p-6 text-center">
    <h1 className="text-3xl font-extrabold mb-6 text-blue-700">🎤 Welcome to Audio Tools</h1>
    <p className="text-gray-600 text-lg">
      Explore our advanced tools for audio denoising and voice cloning. Use the navigation bar to get started!
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <nav className="bg-blue-700 p-4 text-white flex justify-between items-center shadow-lg">
          <h1 className="font-bold text-xl">🎧 Audio Toolkit</h1>
          <div className="space-x-6">
            <Link to="/" className="hover:underline text-lg">Home</Link>
            <Link to="/denoise" className="hover:underline text-lg">Audio Denoiser</Link>
          </div>
        </nav>
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/denoise" element={<AudioDenoiser />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
