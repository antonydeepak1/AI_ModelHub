// src/nodes/NodeSidebar.jsx
import React from 'react';

const NodeSidebar = ({ saveFlow, loadFlow }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-black border-r border-gray-800 p-4 space-y-4 text-sm">
      <h2 className="font-bold text-lg mb-6 text-center">Flow Nodes</h2>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'medicalProcessor')}
        className="bg-white text-black hover:bg-gray-200 p-3 rounded text-center shadow-lg transition-colors cursor-move"
      >
        Medical Processor
      </div>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'generate')}
        className="bg-white text-black hover:bg-gray-200 p-3 rounded text-center shadow-lg transition-colors cursor-move"
      >
        Comedy Generator
      </div>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'output')}
        className="bg-white text-black hover:bg-gray-200 p-3 rounded text-center shadow-lg transition-colors cursor-move"
      >
        Output Viewer
      </div>

      <div className="divider my-4 border-t border-gray-800"></div>

      <div className="space-y-3 pt-2">
        <button
          onClick={saveFlow}
          className="block w-full px-4 py-2 bg-white hover:bg-gray-200 text-black font-semibold rounded shadow transition-colors"
        >
          💾 Save Flow
        </button>

        <button
          onClick={loadFlow}
          className="block w-full px-4 py-2 bg-white hover:bg-gray-200 text-black font-semibold rounded shadow transition-colors"
        >
          📤 Load Flow
        </button>
      </div>
    </aside>
  );
};

export default NodeSidebar;
