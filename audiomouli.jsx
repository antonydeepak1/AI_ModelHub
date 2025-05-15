import React, { useState } from 'react';
import axios from 'axios';

export default function AudioDenoiser() {
  const [inputFile, setInputFile] = useState(null);
  const [denoisedAudioURL, setDenoisedAudioURL] = useState('');
  const [cloneFile, setCloneFile] = useState(null);
  const [cloneText, setCloneText] = useState('');
  const [clonedAudioURL, setClonedAudioURL] = useState('');

  const API_BASE = "https://a9f9-34-143-201-245.ngrok-free.app";

  const handleDenoise = async () => {
    if (!inputFile) {
      alert("Please select an audio file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", inputFile);

    try {
      const response = await axios.post(`${API_BASE}/denoise/`, formData, {
        responseType: 'blob', // Ensure the response is treated as a binary blob
      });
      const blobUrl = URL.createObjectURL(response.data); // Create a URL for the blob
      setDenoisedAudioURL(blobUrl); // Set the URL to the state
    } catch (err) {
      console.error("Denoise error:", err);
      alert("Failed to denoise audio. Please try again.");
    }
  };

  const handleVoiceClone = async () => {
    if (!cloneFile || !cloneText) {
      alert("Please provide audio and text");
      return;
    }
    const formData = new FormData();
    formData.append("audio", cloneFile);
    formData.append("text", cloneText);

    try {
      const response = await axios.post(`${API_BASE}/clone-voice/`, formData, {
        responseType: 'blob',
      });
      const blobUrl = URL.createObjectURL(response.data);
      setClonedAudioURL(blobUrl);
    } catch (err) {
      console.error("Voice clone error:", err);
      alert("Failed to clone voice.");
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
        🎧 Audio Toolkit
      </h1>

      {/* Audio Denoiser Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Audio Denoiser</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Upload Audio File:
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setInputFile(e.target.files[0])}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
          />
          <button
            onClick={handleDenoise}
            className="mt-4 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Denoise Audio
          </button>
          {denoisedAudioURL && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Denoised Audio:</h3>
              <audio controls className="w-full">
                <source src={denoisedAudioURL} type="audio/wav" />
              </audio>
            </div>
          )}
        </div>
      </div>

      {/* Voice Cloner Section */}
      <div>
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Voice Cloner</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Upload Audio File:
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setCloneFile(e.target.files[0])}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 focus:outline-none"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">
            Enter Text to Clone:
          </label>
          <textarea
            value={cloneText}
            onChange={(e) => setCloneText(e.target.value)}
            placeholder="Enter text to clone..."
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 focus:outline-none"
            rows="4"
          />
          <button
            onClick={handleVoiceClone}
            className="mt-4 w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
          >
            Clone Voice
          </button>
          {clonedAudioURL && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Cloned Audio:</h3>
              <audio controls className="w-full">
                <source src={clonedAudioURL} type="audio/wav" />
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}