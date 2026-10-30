import React, { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from '@xyflow/react';

export const OrthogonalEdge = memo(function OrthogonalEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: selected ? 2.5 : (style.strokeWidth || 1.8),
          stroke: selected ? '#3B82F6' : (style.stroke || '#64748B'),
          strokeDasharray: style.strokeDasharray,
          ...style,
        }}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 10,
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold border shadow-xs transition-all select-none ${
              selected
                ? 'bg-blue-50 border-blue-400 text-blue-700 ring-2 ring-blue-400/30'
                : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});
