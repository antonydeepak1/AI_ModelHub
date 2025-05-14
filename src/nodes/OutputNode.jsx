// src/nodes/OutputNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const OutputNode = ({ data, isConnectable }) => {
  const result = data.result;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-72 border-l-4 border-gray-500">
      <div className="font-bold text-black mb-2">Output Viewer</div>

      {result ? (
        <div className="text-black space-y-3 text-sm">
          {/* Comedy Output */}
          {result.setup && result.punchline ? (
            <>
              <div>
                <span className="font-semibold">Setup:</span>
                <p className="italic">{result.setup}</p>
              </div>
              <div>
                <span className="font-semibold">Punchline:</span>
                <p className="italic">{result.punchline}</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="font-semibold">Full Joke:</span>
                <p className="mt-1 text-gray-700">{result.result}</p>
              </div>
            </>
          ) : (
            // Medical or generic output
            <div>
              <span className="font-semibold">Result:</span>
              <p className="italic whitespace-pre-wrap max-h-40 overflow-auto text-gray-800">
                {result.translated_text || JSON.stringify(result, null, 2)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 text-gray-500 italic text-center">
          Output will appear here after processing.
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-black"
      />
    </div>
  );
};

export default OutputNode;
