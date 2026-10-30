import { Node, Edge, MarkerType } from '@xyflow/react';
import { ElementType, DiagramElementData } from '@/types/diagram';

export interface ParsedGraph {
  nodes: Node[];
  edges: Edge[];
  direction: 'TB' | 'LR';
}

interface NodeProperty {
  icon?: string;
  color?: string;
  label?: string;
  shape?: string;
}

function parseProperties(rawProps: string): NodeProperty {
  const result: NodeProperty = {};
  const cleaned = rawProps.trim().replace(/^\[|\]$/g, '');
  const pairs = cleaned.split(',');

  for (const pair of pairs) {
    const [key, ...valParts] = pair.split(':');
    if (key && valParts.length > 0) {
      const k = key.trim().toLowerCase();
      const v = valParts.join(':').trim().replace(/^["']|["']$/g, '');
      if (k === 'icon') result.icon = v;
      if (k === 'color') result.color = v;
      if (k === 'label') result.label = v;
      if (k === 'shape') result.shape = v;
    }
  }
  return result;
}

export function parseEraserDsl(code: string): ParsedGraph {
  const lines = code.split('\n');
  const nodesMap = new Map<string, Node>();
  const edges: Edge[] = [];
  let direction: 'TB' | 'LR' = 'LR';

  let currentGroup: string | null = null;
  let edgeIndex = 0;

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('//') || line.startsWith('#')) continue;

    // Check direction
    if (line.toLowerCase().startsWith('direction')) {
      if (line.toLowerCase().includes('down')) direction = 'TB';
      if (line.toLowerCase().includes('right')) direction = 'LR';
      continue;
    }

    // Group close
    if (line === '}') {
      currentGroup = null;
      continue;
    }

    // Group open: e.g. "VPC Subnet [color: blue] {"
    const groupMatch = line.match(/^([a-zA-Z0-9_\-\s]+)(?:\[(.*?)\])?\s*\{$/);
    if (groupMatch) {
      const groupId = `group-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const groupName = groupMatch[1].trim();
      const props = groupMatch[2] ? parseProperties(groupMatch[2]) : {};

      const groupNode: Node = {
        id: groupId,
        type: 'group',
        position: { x: 0, y: 0 },
        style: { width: 450, height: 280 },
        data: {
          label: props.label || groupName,
          badge: 'Group',
          strokeColor: props.color || '#3B82F6',
          strokeStyle: 'dashed',
          fillColor: 'rgba(59, 130, 246, 0.04)',
        },
      };

      nodesMap.set(groupName.toLowerCase(), groupNode);
      currentGroup = groupId;
      continue;
    }

    // Connections: e.g. "Storage > Server: Cache Hit [color: green]"
    // Operators: >, <, <>, -, --, -->
    const connMatch = line.match(/^([a-zA-Z0-9_\-\s]+?)\s*(>|<|<>|-|--|-->)\s*([a-zA-Z0-9_\-\s,]+?)(?::\s*([^\[]+))?(?:\[(.*?)\])?$/);
    if (connMatch) {
      const sourceName = connMatch[1].trim();
      const operator = connMatch[2];
      const targetNames = connMatch[3].split(',').map(t => t.trim());
      const label = connMatch[4]?.trim().replace(/^["']|["']$/g, '') || '';
      const props = connMatch[5] ? parseProperties(connMatch[5]) : {};

      // Ensure source exists
      let sourceNode = nodesMap.get(sourceName.toLowerCase());
      if (!sourceNode) {
        const id = `node-${sourceName.toLowerCase().replace(/\s+/g, '-')}`;
        sourceNode = {
          id,
          type: 'architecture',
          position: { x: 0, y: 0 },
          parentId: currentGroup || undefined,
          data: { label: sourceName, icon: 'api-gateway' },
        };
        nodesMap.set(sourceName.toLowerCase(), sourceNode);
      }

      // Connect to all targets
      for (const targetName of targetNames) {
        if (!targetName) continue;
        let targetNode = nodesMap.get(targetName.toLowerCase());
        if (!targetNode) {
          const id = `node-${targetName.toLowerCase().replace(/\s+/g, '-')}`;
          targetNode = {
            id,
            type: 'architecture',
            position: { x: 0, y: 0 },
            parentId: currentGroup || undefined,
            data: { label: targetName, icon: 'database' },
          };
          nodesMap.set(targetName.toLowerCase(), targetNode);
        }

        const isDotted = operator === '--' || operator === '-->';
        const hasArrow = operator === '>' || operator === '-->' || operator === '<>';
        const isBidirectional = operator === '<>';

        edges.push({
          id: `edge-${edgeIndex++}`,
          source: sourceNode.id,
          target: targetNode.id,
          label: label || undefined,
          type: 'orthogonal',
          markerEnd: hasArrow ? { type: MarkerType.ArrowClosed, color: props.color || '#64748B' } : undefined,
          markerStart: isBidirectional ? { type: MarkerType.ArrowClosed, color: props.color || '#64748B' } : undefined,
          style: {
            stroke: props.color || '#64748B',
            strokeWidth: 1.8,
            strokeDasharray: isDotted ? '5 5' : undefined,
          },
        });
      }
      continue;
    }

    // Node definition: e.g. "Server [icon: aws-ec2, color: blue, label: 'Compute API']"
    const nodeMatch = line.match(/^([a-zA-Z0-9_\-\s]+?)(?:\[(.*?)\])?$/);
    if (nodeMatch) {
      const nodeName = nodeMatch[1].trim();
      const props = nodeMatch[2] ? parseProperties(nodeMatch[2]) : {};
      const id = `node-${nodeName.toLowerCase().replace(/\s+/g, '-')}`;

      const newNode: Node = {
        id,
        type: 'architecture',
        position: { x: 0, y: 0 },
        parentId: currentGroup || undefined,
        data: {
          label: props.label || nodeName,
          subtitle: props.shape || undefined,
          icon: props.icon || undefined,
          strokeColor: props.color || undefined,
        },
      };

      nodesMap.set(nodeName.toLowerCase(), newNode);
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
    direction,
  };
}
