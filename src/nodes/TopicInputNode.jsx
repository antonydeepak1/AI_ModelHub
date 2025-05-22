import React from 'react';
import { Handle, Position } from '@xyflow/react';

const TopicInputNode = ({ data, isConnectable }) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-md w-60 border border-gray-300">
      <div className="font-bold text-black mb-2">Comedy Topic</div>
      <input
        type="text"
        className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
        value={data.text || ''}
        onChange={(e) => data.onChange(data.id, e.target.value)}
        placeholder="Enter comedy topic..."
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-black"
      />
    </div>
  );
};

export default TopicInputNode;
