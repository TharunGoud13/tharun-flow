import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';
import { DiagramElementData, NodeShape } from '@/types/diagram';

export const ShapeNode = memo(function ShapeNode({ data, selected }: NodeProps) {
  const nodeData = data as DiagramElementData;
  const shape: NodeShape = nodeData.shape || 'rectangle';

  const strokeColor = nodeData.strokeColor || '#94A3B8';
  const fillColor = nodeData.fillColor || '#F8FAFC';
  const strokeWidth = nodeData.strokeWidth || 2;
  const strokeStyle = nodeData.strokeStyle || 'solid';

  const getShapeClasses = () => {
    switch (shape) {
      case 'ellipse':
        return 'rounded-full';
      case 'capsule':
        return 'rounded-full';
      case 'diamond':
        return 'rotate-45';
      case 'cylinder':
        return 'rounded-t-2xl rounded-b-2xl';
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div className="relative group w-full h-full min-w-[100px] min-h-[60px] flex items-center justify-center select-none">
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={50}
        lineClassName="border-blue-500"
        handleClassName="h-2.5 w-2.5 bg-white border-2 border-blue-500 rounded"
      />

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-2.5 !h-2.5 !bg-slate-400 group-hover:!bg-blue-500 !border-2 !border-white transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2.5 !h-2.5 !bg-slate-400 group-hover:!bg-blue-500 !border-2 !border-white transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-2.5 !h-2.5 !bg-slate-400 group-hover:!bg-blue-500 !border-2 !border-white transition-colors"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2.5 !h-2.5 !bg-slate-400 group-hover:!bg-blue-500 !border-2 !border-white transition-colors"
      />

      {/* Main Shape Container */}
      <div
        className={`w-full h-full flex items-center justify-center p-3 transition-all ${getShapeClasses()} ${
          selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        }`}
        style={{
          backgroundColor: fillColor,
          borderColor: strokeColor,
          borderWidth: `${strokeWidth}px`,
          borderStyle: strokeStyle,
        }}
      >
        <span
          className={`text-sm font-medium text-slate-800 text-center select-none ${
            shape === 'diamond' ? '-rotate-45' : ''
          }`}
        >
          {nodeData.label || 'Shape'}
        </span>
      </div>
    </div>
  );
});

