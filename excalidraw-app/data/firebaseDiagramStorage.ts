import { loadFirestore } from "./firebase";

import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AppState } from "@excalidraw/excalidraw/types";

export interface FirebaseDiagramMetadata {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  elementCount: number;
}

export interface FirebaseDiagramRecord {
  id: string;
  name: string;
  elements: readonly ExcalidrawElement[];
  appState?: Partial<AppState>;
  createdAt: number;
  updatedAt: number;
}

const COLLECTION_NAME = "scenes";
const INDEX_DOC_ID = "tharun_flow_diagrams_index";
const ACTIVE_ID_KEY = "tharun_flow_active_diagram_id";

export const getActiveDiagramId = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_ID_KEY);
  } catch {
    return null;
  }
};

export const setActiveDiagramId = (id: string): void => {
  try {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  } catch (err) {
    console.error("Failed to store active diagram id:", err);
  }
};

const getDiagramDocId = (id: string) => `tharun_flow_diagram_${id}`;

/**
 * List all saved diagrams from Firebase Firestore index table.
 */
export const listFirebaseDiagrams = async (): Promise<FirebaseDiagramMetadata[]> => {
  try {
    const { firestore, doc, getDoc } = await loadFirestore();
    const idxDocRef = doc(firestore, COLLECTION_NAME, INDEX_DOC_ID);
    const snap = await getDoc(idxDocRef);

    if (!snap.exists()) {
      return [];
    }

    const data = snap.data();
    const list: FirebaseDiagramMetadata[] = Array.isArray(data?.diagrams)
      ? data.diagrams
      : [];

    // Sort newest first
    list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return list;
  } catch (err) {
    console.error("Failed to list diagrams from Firebase:", err);
    return [];
  }
};

/**
 * Load a full diagram document by ID from Firebase Firestore.
 */
export const loadFirebaseDiagram = async (
  id: string,
): Promise<FirebaseDiagramRecord | null> => {
  try {
    const { firestore, doc, getDoc } = await loadFirestore();
    const docRef = doc(firestore, COLLECTION_NAME, getDiagramDocId(id));
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return null;
    }

    const data = snap.data();
    let elements: readonly ExcalidrawElement[] = [];
    let appState: Partial<AppState> = {};

    try {
      if (typeof data.elements === "string") {
        elements = JSON.parse(data.elements);
      } else if (Array.isArray(data.elements)) {
        elements = data.elements;
      }
    } catch (e) {
      console.warn("Failed to parse diagram elements from Firebase", e);
    }

    try {
      if (typeof data.appState === "string") {
        appState = JSON.parse(data.appState);
      } else if (data.appState && typeof data.appState === "object") {
        appState = data.appState;
      }
    } catch (e) {
      console.warn("Failed to parse diagram appState from Firebase", e);
    }

    return {
      id: data.id || id,
      name: data.name || "Untitled Diagram",
      elements,
      appState,
      createdAt: data.createdAt || Date.now(),
      updatedAt: data.updatedAt || Date.now(),
    };
  } catch (err) {
    console.error(`Failed to load diagram ${id} from Firebase:`, err);
    return null;
  }
};

/**
 * Save diagram to Firebase Firestore only when the user explicitly clicks Save.
 */
export const saveDiagramToFirebase = async (
  diagram: FirebaseDiagramRecord,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { firestore, doc, setDoc, getDoc } = await loadFirestore();
    const now = Date.now();
    const docId = getDiagramDocId(diagram.id);

    const nonDeletedElements = (diagram.elements || []).filter(
      (el) => !el.isDeleted,
    );

    // 1. Save diagram document in scenes table
    await setDoc(doc(firestore, COLLECTION_NAME, docId), {
      id: diagram.id,
      name: diagram.name,
      elements: JSON.stringify(nonDeletedElements),
      appState: JSON.stringify(diagram.appState || {}),
      createdAt: diagram.createdAt || now,
      updatedAt: now,
      isDiagram: true,
    });

    // 2. Update index document in scenes table
    const idxDocRef = doc(firestore, COLLECTION_NAME, INDEX_DOC_ID);
    const snap = await getDoc(idxDocRef);
    let list: FirebaseDiagramMetadata[] = [];
    if (snap.exists() && Array.isArray(snap.data()?.diagrams)) {
      list = [...snap.data().diagrams];
    }

    const existingIdx = list.findIndex((d) => d.id === diagram.id);
    const meta: FirebaseDiagramMetadata = {
      id: diagram.id,
      name: diagram.name,
      createdAt: diagram.createdAt || now,
      updatedAt: now,
      elementCount: nonDeletedElements.length,
    };

    if (existingIdx >= 0) {
      list[existingIdx] = meta;
    } else {
      list.unshift(meta);
    }

    await setDoc(idxDocRef, {
      diagrams: list,
      updatedAt: now,
    });

    setActiveDiagramId(diagram.id);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to save diagram to Firebase:", err);
    return {
      success: false,
      error: err?.message || "Failed to save to Firebase",
    };
  }
};

/**
 * Delete diagram from Firebase Firestore document and index table.
 */
export const deleteFirebaseDiagram = async (id: string): Promise<boolean> => {
  try {
    const { firestore, doc, setDoc, getDoc, deleteDoc } = await loadFirestore();
    // 1. Delete diagram document
    await deleteDoc(doc(firestore, COLLECTION_NAME, getDiagramDocId(id)));

    // 2. Remove from index document
    const idxDocRef = doc(firestore, COLLECTION_NAME, INDEX_DOC_ID);
    const snap = await getDoc(idxDocRef);
    if (snap.exists() && Array.isArray(snap.data()?.diagrams)) {
      const list = snap.data().diagrams.filter((d: any) => d.id !== id);
      await setDoc(idxDocRef, {
        diagrams: list,
        updatedAt: Date.now(),
      });
    }

    return true;
  } catch (err) {
    console.error("Failed to delete diagram from Firebase:", err);
    return false;
  }
};

/**
 * Rename diagram in Firebase Firestore.
 */
export const renameFirebaseDiagram = async (
  id: string,
  newName: string,
): Promise<boolean> => {
  try {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    const existing = await loadFirebaseDiagram(id);
    if (!existing) return false;

    existing.name = trimmed;
    const result = await saveDiagramToFirebase(existing);
    return result.success;
  } catch (err) {
    console.error("Failed to rename diagram in Firebase:", err);
    return false;
  }
};

/**
 * Duplicate an existing diagram in Firebase Firestore.
 */
export const duplicateFirebaseDiagram = async (
  sourceId: string,
): Promise<FirebaseDiagramRecord | null> => {
  const source = await loadFirebaseDiagram(sourceId);
  if (!source) {
    return null;
  }

  const id = `diag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record: FirebaseDiagramRecord = {
    ...source,
    id,
    name: `${source.name} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const res = await saveDiagramToFirebase(record);
  if (res.success) {
    return record;
  }
  return null;
};

/**
 * Create a new blank diagram model (ready to be edited and saved to Firebase).
 */
export const createNewDiagramRecord = (name?: string): FirebaseDiagramRecord => {
  const id = `diag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    name:
      name?.trim() ||
      `Diagram ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    elements: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

/**
 * Initializes Firebase diagram storage on application startup.
 * Checks for existing active diagram or first diagram in Firebase index.
 */
export const initFirebaseDiagramStorage = async (
  legacyElements: readonly ExcalidrawElement[] = [],
): Promise<FirebaseDiagramRecord> => {
  try {
    const list = await listFirebaseDiagrams();
    const activeId = getActiveDiagramId();

    if (activeId) {
      const activeMeta = list.find((d) => d.id === activeId);
      if (activeMeta) {
        const full = await loadFirebaseDiagram(activeMeta.id);
        if (full) {
          return full;
        }
      }
    }

    if (list.length > 0) {
      const first = await loadFirebaseDiagram(list[0].id);
      if (first) {
        setActiveDiagramId(first.id);
        return first;
      }
    }
  } catch (err) {
    console.error("Error during initFirebaseDiagramStorage:", err);
  }

  // If no diagrams exist in Firebase, create the first diagram
  const initial = createNewDiagramRecord("My Architecture Flow");
  if (legacyElements && legacyElements.length > 0) {
    initial.elements = legacyElements;
  }
  // Save initial diagram to Firebase so it is persistent right from start
  await saveDiagramToFirebase(initial);
  return initial;
};

