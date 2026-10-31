import { loadFirestore } from "./firebase";
import { restoreLibraryItems } from "@excalidraw/excalidraw/data/restore";
import type { LibraryItems } from "@excalidraw/excalidraw/types";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

const COLLECTION_NAME = "scenes";
const META_DOC_ID = "tharun_flow_libraries_meta";
const CHUNK_DOC_PREFIX = "tharun_flow_libraries_chunk_";
const CHUNK_SIZE = 25;

export interface LibraryMetaRecord {
  totalItems: number;
  chunksCount: number;
  updatedAt: number;
}

/**
 * Loads all library items from Firebase Firestore chunks.
 */
export const loadLibrariesFromFirebase = async (): Promise<LibraryItems | null> => {
  try {
    const { firestore, doc, getDoc } = await loadFirestore();
    const metaRef = doc(firestore, COLLECTION_NAME, META_DOC_ID);
    const metaSnap = await getDoc(metaRef);

    if (!metaSnap.exists()) {
      return null;
    }

    const meta = metaSnap.data() as LibraryMetaRecord;
    if (!meta || !meta.chunksCount || meta.chunksCount === 0) {
      return null;
    }

    const chunkPromises: Promise<any>[] = [];
    for (let i = 0; i < meta.chunksCount; i++) {
      const chunkRef = doc(firestore, COLLECTION_NAME, `${CHUNK_DOC_PREFIX}${i}`);
      chunkPromises.push(getDoc(chunkRef));
    }

    const chunkSnaps = await Promise.all(chunkPromises);
    const allItems: any[] = [];

    for (const snap of chunkSnaps) {
      if (snap.exists()) {
        const chunkData = snap.data();
        if (chunkData && Array.isArray(chunkData.items)) {
          allItems.push(...chunkData.items);
        }
      }
    }

    if (allItems.length === 0) {
      return null;
    }

    return restoreLibraryItems(allItems, "published");
  } catch (err) {
    console.warn("Failed to load libraries from Firebase:", err);
    return null;
  }
};

/**
 * Saves all library items to Firebase Firestore in chunked documents.
 */
export const saveLibrariesToFirebase = async (items: LibraryItems): Promise<void> => {
  if (!items) return;
  try {
    const { firestore, doc, setDoc, deleteDoc, getDoc } = await loadFirestore();

    // Check previous chunk count to clean up removed chunks
    let prevChunksCount = 0;
    try {
      const metaRef = doc(firestore, COLLECTION_NAME, META_DOC_ID);
      const metaSnap = await getDoc(metaRef);
      if (metaSnap.exists()) {
        prevChunksCount = (metaSnap.data() as LibraryMetaRecord)?.chunksCount || 0;
      }
    } catch {}

    const chunksCount = Math.ceil(items.length / CHUNK_SIZE);
    const writePromises: Promise<void>[] = [];

    for (let i = 0; i < chunksCount; i++) {
      const chunkItems = items.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const chunkRef = doc(firestore, COLLECTION_NAME, `${CHUNK_DOC_PREFIX}${i}`);
      writePromises.push(
        setDoc(chunkRef, {
          items: chunkItems,
          index: i,
          updatedAt: Date.now(),
        }),
      );
    }

    // Delete obsolete chunks if library shrunk
    if (prevChunksCount > chunksCount) {
      for (let i = chunksCount; i < prevChunksCount; i++) {
        const chunkRef = doc(firestore, COLLECTION_NAME, `${CHUNK_DOC_PREFIX}${i}`);
        writePromises.push(deleteDoc(chunkRef).catch(() => {}));
      }
    }

    // Update metadata
    const metaRef = doc(firestore, COLLECTION_NAME, META_DOC_ID);
    writePromises.push(
      setDoc(metaRef, {
        totalItems: items.length,
        chunksCount,
        updatedAt: Date.now(),
      }),
    );

    await Promise.all(writePromises);
  } catch (err) {
    console.error("Failed to save libraries to Firebase Firestore:", err);
  }
};

/**
 * Curated list of top libraries from https://libraries.excalidraw.com
 */
export interface CuratedLibraryDef {
  id: string;
  name: string;
  description: string;
  category: "architecture" | "cloud" | "tech" | "diagrams";
  author: string;
  url: string;
  itemCountEstimated: number;
}

export const CURATED_LIBRARIES: CuratedLibraryDef[] = [
  {
    id: "software-architecture",
    name: "Software Architecture",
    description: "Microservices, databases, caches, message queues, code/docs, browser, and mobile devices.",
    category: "architecture",
    author: "Youri Tjang",
    url: "/libraries/software-architecture.excalidrawlib",
    itemCountEstimated: 7,
  },
  {
    id: "aws-serverless",
    name: "AWS Serverless Icons",
    description: "Lambda, API Gateway, DynamoDB, S3, EventBridge, SNS, SQS, CloudFront, Cognito, and Step Functions.",
    category: "cloud",
    author: "Slobodan Stojanović",
    url: "/libraries/aws-serverless.excalidrawlib",
    itemCountEstimated: 15,
  },
  {
    id: "aws-simple-icons",
    name: "AWS Simple Icons",
    description: "Monochrome & color cloud icons for EC2, RDS, S3, SQS, and Lambda.",
    category: "cloud",
    author: "Husain Khambaty",
    url: "/libraries/aws-simple-icons.excalidrawlib",
    itemCountEstimated: 17,
  },
  {
    id: "azure-cloud-services",
    name: "Azure Cloud Services",
    description: "App Service, Azure SQL, CosmosDB, Blob Storage, Functions, and AKS container services.",
    category: "cloud",
    author: "Youri Tjang",
    url: "/libraries/azure-cloud-services.excalidrawlib",
    itemCountEstimated: 19,
  },
  {
    id: "technology-logos",
    name: "Cloud-Native Tech Logos",
    description: "Kubernetes, Docker, Git, Terraform, Kafka, Spring, Redis, Knative, OpenStack, and Kotlin.",
    category: "tech",
    author: "Matthias Haeussler",
    url: "/libraries/technology-logos.excalidrawlib",
    itemCountEstimated: 18,
  },
  {
    id: "software-logos",
    name: "Software & System Logos",
    description: "Postgres, NGINX, RabbitMQ, Redis, Load Balancer, Reverse Proxy, Server, Chip, and DB.",
    category: "tech",
    author: "drwnio",
    url: "/libraries/software-logos.excalidrawlib",
    itemCountEstimated: 18,
  },
  {
    id: "uml-er-diagrams",
    name: "UML & ER Diagrams",
    description: "Components for UML class diagrams, database schemas, entities, relationships, and connectors.",
    category: "diagrams",
    author: "BjoernKW",
    url: "/libraries/uml-er-diagrams.excalidrawlib",
    itemCountEstimated: 21,
  },
  {
    id: "cloud-design-patterns",
    name: "Cloud Design Patterns",
    description: "Visual components for CQRS, Event Sourcing, Circuit Breaker, Ambassador, and Gateway routing.",
    category: "architecture",
    author: "Michel Caradec",
    url: "/libraries/cloud-design-patterns.excalidrawlib",
    itemCountEstimated: 14,
  },
  {
    id: "system-design-template",
    name: "System Design Template",
    description: "Standard structure & process for high-level system design interviews and architectural flows.",
    category: "architecture",
    author: "James Wiens",
    url: "/libraries/system-design-template.excalidrawlib",
    itemCountEstimated: 12,
  },
  {
    id: "data-science",
    name: "Data Science & AI Logos",
    description: "Airflow, Jupyter, Pandas, NumPy, TensorFlow, PyTorch, Scikit-learn, and Keras.",
    category: "tech",
    author: "Fares Hasan",
    url: "/libraries/data-science.excalidrawlib",
    itemCountEstimated: 8,
  },
];

/**
 * Installs a library into Excalidraw and saves it to Firebase Firestore.
 */
export const installLibrary = async (
  lib: CuratedLibraryDef,
  excalidrawAPI: ExcalidrawImperativeAPI,
): Promise<number> => {
  try {
    const res = await fetch(lib.url);
    if (!res.ok) {
      throw new Error(`Failed to load ${lib.url}: HTTP ${res.status}`);
    }
    const data = await res.json();
    const sourceItems = data.library || data.libraryItems || [];

    if (!Array.isArray(sourceItems) || sourceItems.length === 0) {
      throw new Error("No elements found in library file");
    }

    await excalidrawAPI.updateLibrary({
      libraryItems: sourceItems,
      merge: true,
      openLibraryMenu: true,
    });

    return sourceItems.length;
  } catch (err) {
    console.error(`Failed to install library "${lib.name}":`, err);
    throw err;
  }
};
