'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const TldrawStudio = dynamic(
  () => import('@/components/editor/TldrawStudio').then((m) => m.TldrawStudio),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-3 select-none">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3.5 h-6 bg-[#E11D48] rounded-xs -skew-x-12 inline-block"></span>
          <span className="w-3.5 h-6 bg-[#0284C7] rounded-xs -skew-x-12 -ml-1 inline-block"></span>
          <span className="font-bold text-2xl tracking-tight text-white ml-1">tharun-flow</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
          <Loader2 size={14} className="animate-spin text-blue-500" />
          <span>Restoring diagram from IndexedDB...</span>
        </div>
      </div>
    ),
  }
);

function DiagramContent() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'default';
  return <TldrawStudio diagramId={id} />;
}

export default function DiagramPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-slate-900" />}>
      <DiagramContent />
    </Suspense>
  );
}
