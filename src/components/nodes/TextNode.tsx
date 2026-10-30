import React, { memo } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { DiagramElementData } from '@/types/diagram';

export const TextNode = memo(function TextNode({ data, selected }: NodeProps) {
  const nodeData = data as DiagramElementData;

  return (
    <div
      className={`relative p-2 rounded-lg transition-all min-w-[100px] select-none ${
        selected ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:bg-slate-100/50'
      }`}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={60}
        minHeight={30}
        lineClassName="border-blue-500"
        handleClassName="h-2 w-2 bg-white border border-blue-500 rounded"
      />
      <div className="text-sm font-medium text-slate-800 leading-snug break-words">
        {nodeData.label || 'Double click to edit text'}
      </div>
    </div>
  );
});

