import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';
import { getTechIcon } from '@/lib/icons/techIcons';
import { DiagramElementData } from '@/types/diagram';

export const ArchitectureNode = memo(function ArchitectureNode({
  data,
  selected,
}: NodeProps) {
  const nodeData = data as DiagramElementData;
  const iconDef = getTechIcon(nodeData.icon);

  const strokeColor = nodeData.strokeColor || '#E2E8F0';
  const fillColor = nodeData.fillColor || '#FFFFFF';

  return (
    <div
      className={`relative rounded-xl border-2 transition-all group px-3.5 py-2.5 min-w-[190px] shadow-xs select-none ${
        selected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:border-slate-400'
      }`}
      style={{
        backgroundColor: fillColor,
        borderColor: selected ? '#3B82F6' : strokeColor,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={160}
        minHeight={60}
        lineClassName="border-blue-500"
        handleClassName="h-2.5 w-2.5 bg-white border-2 border-blue-500 rounded"
      />

      {/* Connection Handles on 4 Sides */}
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

      <div className="flex items-center gap-3">
        {/* Tech Icon Box */}
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shadow-2xs">
          {iconDef.render({ size: 20 })}
        </div>

        {/* Labels */}
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-[13px] font-semibold text-slate-800 tracking-tight leading-tight truncate">
            {nodeData.label || 'Component'}
          </span>
          {nodeData.subtitle && (
            <span className="text-[11px] text-slate-500 leading-tight truncate mt-0.5 font-medium">
              {nodeData.subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
