import React, { memo } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { DiagramElementData } from '@/types/diagram';
import { Layers } from 'lucide-react';

export const GroupNode = memo(function GroupNode({ data, selected }: NodeProps) {
  const nodeData = data as DiagramElementData;

  const strokeColor = nodeData.strokeColor || '#94A3B8';
  const fillColor = nodeData.fillColor || 'rgba(241, 245, 249, 0.4)';
  const strokeStyle = nodeData.strokeStyle || 'dashed';

  return (
    <div
      className={`relative w-full h-full rounded-2xl border-2 transition-all p-3 min-w-[240px] min-h-[160px] select-none ${
        selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        backgroundColor: fillColor,
        borderColor: strokeColor,
        borderStyle: strokeStyle,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={140}
        lineClassName="border-blue-500"
        handleClassName="h-3 w-3 bg-white border-2 border-blue-500 rounded"
      />

      {/* Header bar / Badge */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase border shadow-2xs"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: strokeColor,
            color: strokeColor,
          }}
        >
          <Layers size={12} />
          <span>{nodeData.badge || 'Container'}</span>
        </div>

        <span className="text-xs font-semibold text-slate-700 truncate">
          {nodeData.label || 'Group Boundary'}
        </span>
      </div>
    </div>
  );
});

