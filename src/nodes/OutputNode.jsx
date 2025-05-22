import React from 'react';
import { Handle, Position } from '@xyflow/react';

const OutputNode = ({ data, isConnectable }) => {
return ( <div className="bg-white rounded-lg p-4 shadow-md w-72 border-l-4 border-gray-500"> <div className="font-bold text-black mb-2">Comedy Output</div>
{data.result ? ( <div className="text-black space-y-3 text-sm"> <div> <span className="font-semibold">Setup:</span> <p className="italic">{data.result.setup}</p> </div> <div> <span className="font-semibold">Punchline:</span> <p className="italic">{data.result.punchline}</p> </div> <div className="pt-2 border-t border-gray-200"> <span className="font-semibold">Full Joke:</span> <p className="mt-1 text-gray-700">{data.result.result}</p> </div> </div>
) : ( <div className="py-4 text-gray-500 italic text-center">
Generate comedy to see results here... </div>
)} <Handle
     type="target"
     position={Position.Top}
     isConnectable={isConnectable}
     className="w-2 h-2 bg-black"
   /> </div>
);
};

export default OutputNode;
