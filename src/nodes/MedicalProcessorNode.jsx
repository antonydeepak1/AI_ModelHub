// src/nodes/MedicalProcessorNode.jsx
import React, { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import clsx from 'clsx';

const API_URL = import.meta.env.VITE_URL_2;

const MedicalProcessorNode = ({ data, isConnectable }) => {
  const [file, setFile] = useState(null);
  const [processingState, setProcessingState] = useState('idle');
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      toast.success(`Selected: ${e.dataTransfer.files[0].name}`);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      toast.success(`Selected: ${e.target.files[0].name}`);
    }
  };

  const handleSubmit = async () => {
    if (!file) return toast.error('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_lang', 'Tamil');

    setProcessingState('loading');
    try {
      const response = await axios.post(`${API_URL}/medical/process`, formData);
      setResult(response.data);
      data.setResult(data.id, response.data);
      setProcessingState('done');
      toast.success('File processed successfully');
    } catch {
      toast.error('Failed to process file. Please try again.');
      setProcessingState('idle');
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-md w-72 border border-blue-200">
      <div className="font-bold text-blue-700 mb-2 text-center">Medical Processor</div>

      <div
        className={clsx(
          'border-2 border-dashed rounded-xl px-3 py-4 text-center text-sm cursor-pointer transition mb-2',
          isDragging ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300 hover:border-blue-500'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="w-5 h-5 mx-auto mb-1 text-blue-500" />
        {file ? `Selected: ${file.name}` : 'Drop or click to upload'}
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={processingState === 'loading'}
        className={clsx(
          'w-full py-2 mt-2 rounded text-white font-medium transition-colors',
          processingState === 'loading'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        )}
      >
        {processingState === 'loading' ? 'Processing...' : 'Process File'}
      </button>

      {processingState === 'done' && result && (
        <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-2 rounded max-h-32 overflow-auto">
          <strong>Translated:</strong>
          <p>{result.translated_text || 'N/A'}</p>
        </div>
      )}

      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-2 h-2 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-2 h-2 bg-blue-500" />
    </div>
  );
};

export default MedicalProcessorNode;
