// ModeSelectNode.jsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';

const ModeSelectNode = ({ data, isConnectable }) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-md w-60 border border-indigo-200">
      <div className="font-bold text-indigo-700 mb-2">Comedy Mode</div>
      <div className="space-y-2 text-black">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            className="form-radio text-indigo-600"
            name={`mode-${data.id}`}
            value="comedy"
            checked={data.mode === 'comedy'}
            onChange={() => data.onChange(data.id, 'comedy')}
          />
          <span>Stand-up Comedy</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            className="form-radio text-indigo-600"
            name={`mode-${data.id}`}
            value="pickup"
            checked={data.mode === 'pickup'}
            onChange={() => data.onChange(data.id, 'pickup')}
          />
          <span>Pick-up Lines</span>
        </label>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-indigo-500"
      />
    </div>
  );
};

export default ModeSelectNode;
