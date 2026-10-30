import dagre from '@dagrejs/dagre';
import { Node, Edge } from '@xyflow/react';

export function layoutGraphWithDagre(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'LR'
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 80,
    marginx: 40,
    marginy: 40,
  });

  // Filter non-group nodes for dagre layout positioning
  nodes.forEach(node => {
    const width = node.type === 'group' ? 450 : 180;
    const height = node.type === 'group' ? 260 : 74;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const positionedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.type === 'group' ? 450 : 180;
    const height = node.type === 'group' ? 260 : 74;

    return {
      ...node,
      position: {
        x: nodeWithPosition ? nodeWithPosition.x - width / 2 : node.position.x,
        y: nodeWithPosition ? nodeWithPosition.y - height / 2 : node.position.y,
      },
    };
  });

  return {
    nodes: positionedNodes,
    edges,
  };
}

