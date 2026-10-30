import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DiagramDocument } from '@/types/diagram';

interface EraserDBSchema extends DBSchema {
  diagrams: {
    key: string;
    value: DiagramDocument;
    indexes: {
      'by-updated': string;
      'by-title': string;
    };
  };
  settings: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = 'eraser_diagrams_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<EraserDBSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<EraserDBSchema>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only accessible in browser environment'));
  }

  if (!dbPromise) {
    dbPromise = openDB<EraserDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('diagrams')) {
          const store = db.createObjectStore('diagrams', { keyPath: 'id' });
          store.createIndex('by-updated', 'updatedAt');
          store.createIndex('by-title', 'title');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }

  return dbPromise;
}

export function generateDiagramId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  }
  return Math.random().toString(36).substring(2, 18);
}

export async function saveDiagramToIDB(diagram: DiagramDocument): Promise<void> {
  const db = await getDB();
  const updatedDoc: DiagramDocument = {
    ...diagram,
    updatedAt: new Date().toISOString(),
    revision: (diagram.revision || 0) + 1,
  };
  await db.put('diagrams', updatedDoc);
}

export async function getDiagramFromIDB(id: string): Promise<DiagramDocument | null> {
  const db = await getDB();
  const doc = await db.get('diagrams', id);
  return doc || null;
}

export async function deleteDiagramFromIDB(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('diagrams', id);
}

export async function listDiagramsFromIDB(): Promise<
  Array<{ id: string; title: string; updatedAt: string; elementCount: number }>
> {
  const db = await getDB();
  const all = await db.getAllFromIndex('diagrams', 'by-updated');
  return all
    .map(doc => ({
      id: doc.id,
      title: doc.title,
      updatedAt: doc.updatedAt,
      elementCount: doc.elements.length,
    }))
    .reverse(); // Newest first
}

export function createDefaultDiagram(id?: string, title?: string): DiagramDocument {
  const now = new Date().toISOString();
  const diagramId = id || generateDiagramId();

  return {
    schemaVersion: 1,
    id: diagramId,
    title: title || 'System Architecture',
    createdAt: now,
    updatedAt: now,
    revision: 1,
    elements: [
      {
        id: 'group-vpc',
        type: 'group',
        position: { x: 80, y: 80 },
        dimensions: { width: 680, height: 380 },
        data: {
          label: 'Primary VPC (us-east-1)',
          badge: 'AWS VPC',
          strokeColor: '#3B82F6',
          strokeStyle: 'dashed',
          fillColor: 'rgba(59, 130, 246, 0.04)',
        },
      },
      {
        id: 'node-client',
        type: 'architecture',
        position: { x: -160, y: 200 },
        dimensions: { width: 180, height: 74 },
        data: {
          label: 'Client Browser',
          subtitle: 'React SPA',
          icon: 'react',
          fillColor: '#FFFFFF',
          strokeColor: '#61DAFB',
        },
      },
      {
        id: 'node-cf',
        type: 'architecture',
        position: { x: 120, y: 200 },
        dimensions: { width: 180, height: 74 },
        parentId: 'group-vpc',
        data: {
          label: 'Edge Cloudflare',
          subtitle: 'CDN & WAF Proxy',
          icon: 'cloudflare',
          fillColor: '#FFFFFF',
          strokeColor: '#F38020',
        },
      },
      {
        id: 'node-api',
        type: 'architecture',
        position: { x: 380, y: 150 },
        dimensions: { width: 190, height: 74 },
        parentId: 'group-vpc',
        data: {
          label: 'API Gateway',
          subtitle: 'Node.js Express',
          icon: 'nodejs',
          fillColor: '#FFFFFF',
          strokeColor: '#10B981',
        },
      },
      {
        id: 'node-db',
        type: 'architecture',
        position: { x: 380, y: 280 },
        dimensions: { width: 190, height: 74 },
        parentId: 'group-vpc',
        data: {
          label: 'Primary Database',
          subtitle: 'PostgreSQL Relational',
          icon: 'postgresql',
          fillColor: '#FFFFFF',
          strokeColor: '#336791',
        },
      },
    ],
    connections: [
      {
        id: 'edge-client-cf',
        source: 'node-client',
        target: 'node-cf',
        label: 'HTTPS (TLS 1.3)',
        routing: 'orthogonal',
        strokeColor: '#0284C7',
        arrowHead: 'arrow',
      },
      {
        id: 'edge-cf-api',
        source: 'node-cf',
        target: 'node-api',
        label: 'Reverse Proxy',
        routing: 'orthogonal',
        strokeColor: '#10B981',
        arrowHead: 'arrow',
      },
      {
        id: 'edge-api-db',
        source: 'node-api',
        target: 'node-db',
        label: 'SQL Queries',
        routing: 'orthogonal',
        strokeColor: '#336791',
        arrowHead: 'arrow',
      },
    ],
    groups: [
      {
        id: 'group-vpc',
        label: 'Primary VPC (us-east-1)',
        bounds: { x: 80, y: 80, width: 680, height: 380 },
        childrenIds: ['node-cf', 'node-api', 'node-db'],
      },
    ],
    viewport: {
      x: 200,
      y: 120,
      zoom: 1,
    },
    metadata: {
      theme: 'light',
      gridType: 'dots',
    },
  };
}

