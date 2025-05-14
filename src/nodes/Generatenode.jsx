// src/nodes/Generatenode.jsx
import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_URL_2;

const GenerateNode = ({ data, isConnectable }) => {
  const { getNodes } = useReactFlow();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const topicNode = getNodes().find((n) => n.type === 'topicInput');
    const modeNode = getNodes().find((n) => n.type === 'modeSelect');

    if (!topicNode?.data?.text) {
      toast.error('Please provide a comedy topic first');
      return;
    }

    if (!modeNode) {
      toast.error('Please add a Mode Select node');
      return;
    }

    const mode = modeNode.data.mode || 'comedy';

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/generate_comedy/`, {
        text: topicNode.data.text,
        mode: mode,
        max_length: 100,
        temperature: 0.9,
      });

      data.setResult(data.id, response.data);
      toast.success('Comedy generated!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate comedy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-md w-60 border border-green-200 text-center">
      <div className="font-bold text-green-700 mb-2">Generate Comedy</div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`px-4 py-2 rounded font-medium transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {loading ? 'Generating...' : 'Generate 🎭'}
      </button>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-green-500"
      />
    </div>
  );
};

export default GenerateNode;
