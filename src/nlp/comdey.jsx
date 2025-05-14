// src/ComedyFlowApp.jsx
import React, { useCallback, useState } from 'react';
import {
  ReactFlowProvider,
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles/flowStyle.css';
import { toast } from 'sonner';

import TopicInputNode from '../nodes/TopicInputNode.jsx';
import ModeSelectNode from '../nodes/ModeSelectNode.jsx';
import GenerateNode from '../nodes/Generatenode.jsx';
import OutputNode from '../nodes/OutputNode.jsx';
import NodeSidebar from '../nodes/NodeSidebar.jsx';

const API_URL = import.meta.env.VITE_URL_2;

const nodeTypes = {
  topicInput: TopicInputNode,
  modeSelect: ModeSelectNode,
  generate: GenerateNode,
  output: OutputNode,
};

let id = 1;
const getId = () => `${id++}`;

const ComedyFlowApp = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const setTopic = useCallback((id, text) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, text } } : n
      )
    );
  }, [setNodes]);

  const setMode = useCallback((id, mode) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, mode } } : n
      )
    );
  }, [setNodes]);

  const setResult = useCallback((id, result) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.type === 'output' ? { ...n, data: { ...n.data, result } } : n
      )
    );
  }, [setNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newId = getId();
      const newNode = {
        id: newId,
        type,
        position,
        data: {
          id: newId,
          ...(type === 'topicInput' && { text: '', onChange: setTopic }),
          ...(type === 'modeSelect' && { mode: 'comedy', onChange: setMode }),
          ...(type === 'generate' && { setResult }),
          ...(type === 'output' && { result: null }),
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes, setTopic, setMode, setResult]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const saveFlow = () => {
    if (!reactFlowInstance) return;
    const flow = reactFlowInstance.toObject();
    localStorage.setItem('comedy-flow', JSON.stringify(flow));
    toast.success('Flow saved successfully!');
  };

  const loadFlow = () => {
    const flowString = localStorage.getItem('comedy-flow');
    if (!flowString) return toast.error('No saved flow found');

    try {
      const flow = JSON.parse(flowString);
      const restoredNodes = flow.nodes.map((node) => {
        if (node.type === 'topicInput') node.data.onChange = setTopic;
        if (node.type === 'modeSelect') node.data.onChange = setMode;
        if (node.type === 'generate') node.data.setResult = setResult;
        return node;
      });

      setNodes(restoredNodes);
      setEdges(flow.edges);
      toast.success('Flow loaded successfully!');
    } catch (error) {
      console.error('Failed to load flow:', error);
      toast.error('Load failed');
    }
  };

  return (
    <div className="w-full h-screen flex bg-black text-white">
      <NodeSidebar saveFlow={saveFlow} loadFlow={loadFlow} />
      <div className="flex-1 h-full">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls className="bg-black bg-opacity-70 text-white border-gray-800 rounded-md" />
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="bg-black bg-opacity-70 border-gray-800"
            />
            <Background
              variant="dots"
              gap={16}
              size={1}
              color="rgba(255, 255, 255, 0.1)"
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default ComedyFlowApp;
