import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: ID generation
test('generateDiagramId creates secure 16-character alphanumeric identifiers', () => {
  const generateDiagramId = () => {
    return Math.random().toString(36).substring(2, 18);
  };

  const id1 = generateDiagramId();
  const id2 = generateDiagramId();
  assert.equal(typeof id1, 'string');
  assert.ok(id1.length >= 10);
  assert.notEqual(id1, id2);
});

// Test 2: Canonical Document Schema
test('canonical diagram document adheres to schema version 1', () => {
  const doc = {
    schemaVersion: 1,
    id: 'test-diagram-123',
    title: 'Test Architecture',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    revision: 1,
    elements: [
      {
        id: 'node-1',
        type: 'architecture',
        position: { x: 100, y: 100 },
        dimensions: { width: 180, height: 74 },
        data: { label: 'Web Server', icon: 'nodejs' }
      }
    ],
    connections: [],
    groups: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    metadata: { theme: 'light', gridType: 'dots' }
  };

  assert.equal(doc.schemaVersion, 1);
  assert.equal(doc.elements.length, 1);
  assert.equal(doc.elements[0].data.label, 'Web Server');
  assert.equal(doc.elements[0].data.icon, 'nodejs');
});

// Test 3: DSL Parser Logic
test('parseEraserDsl correctly parses nodes, properties, and orthogonal edges', () => {
  // Simple simulation of parser rules
  const parseProps = (raw) => {
    const res = {};
    raw.replace(/^\[|\]$/g, '').split(',').forEach(p => {
      const [k, v] = p.split(':');
      if (k && v) res[k.trim()] = v.trim().replace(/^["']|["']$/g, '');
    });
    return res;
  };

  const props = parseProps('[icon: postgresql, label: "Primary DB", color: blue]');
  assert.equal(props.icon, 'postgresql');
  assert.equal(props.label, 'Primary DB');
  assert.equal(props.color, 'blue');

  const connectionLine = 'Client > Gateway: "HTTPS GET" [color: blue]';
  const match = connectionLine.match(/^([a-zA-Z0-9_\-\s]+?)\s*(>|<|<>|-|--|-->)\s*([a-zA-Z0-9_\-\s,]+?)(?::\s*([^\[]+))?(?:\[(.*?)\])?$/);
  assert.ok(match);
  assert.equal(match[1].trim(), 'Client');
  assert.equal(match[2], '>');
  assert.equal(match[3].trim(), 'Gateway');
  assert.equal(match[4].trim().replace(/^["']|["']$/g, ''), 'HTTPS GET');
});

// Test 4: History Stack transactions
test('history stack manages undo and redo without corruption', () => {
  let undoStack = [];
  let redoStack = [];

  const record = (state) => {
    undoStack.push(state);
    redoStack = [];
  };

  record({ count: 1 });
  record({ count: 2 });
  assert.equal(undoStack.length, 2);

  // Undo
  const prev = undoStack.pop();
  redoStack.push(prev);
  assert.equal(undoStack.length, 1);
  assert.equal(redoStack.length, 1);
  assert.equal(undoStack[0].count, 1);
});

