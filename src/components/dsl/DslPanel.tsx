'use client';

import React, { useState } from 'react';
import { useDiagramStore } from '@/lib/store/diagramStore';
import { parseEraserDsl } from '@/lib/dsl/eraserDslParser';
import { layoutGraphWithDagre } from '@/lib/dsl/dslLayout';
import { Code2, Play, Sparkles, X, BookOpen, Layers } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

const PRESETS = [
  {
    name: '3-Tier Architecture',
    code: `// Direction of layout
direction right

// Define components with tech icons
Client [icon: react, label: "React Frontend"]
Gateway [icon: cloudflare, label: "Cloudflare CDN"]
API [icon: nodejs, label: "Node.js REST API"]
Database [icon: postgresql, label: "PostgreSQL DB"]
Cache [icon: redis, label: "Redis Cache"]

// Define connections with labels
Client > Gateway: "HTTPS GET/POST"
Gateway > API: "Proxy Request"
API > Database: "SQL Queries"
API > Cache: "Cache Lookup"
`,
  },
  {
    name: 'Microservices with Kafka',
    code: `direction right

VPC [color: blue] {
  OrderService [icon: golang, label: "Order Service"]
  PaymentService [icon: python, label: "Payment Service"]
  MessageBroker [icon: kafka, label: "Kafka Event Bus"]
  OrderDB [icon: postgresql, label: "Orders DB"]
}

Client [icon: mobile-app, label: "Mobile Client"] > OrderService: "Place Order"
OrderService > OrderDB: "Persist"
OrderService > MessageBroker: "OrderCreated Event"
MessageBroker > PaymentService: "Consume Event"
`,
  },
  {
    name: 'AWS Cloud Architecture',
    code: `direction right

Users [icon: client-browser, label: "End Users"]
Route53 [icon: aws, label: "Route 53 DNS"]
ALB [icon: aws, label: "Application Load Balancer"]
Compute [icon: aws-ec2, label: "EC2 Auto-scaling"]
Storage [icon: aws-s3, label: "S3 Static Assets"]
RDS [icon: mysql, label: "Aurora MySQL"]

Users > Route53: "DNS Query"
Route53 > ALB: "Traffic Route"
ALB > Compute: "HTTP Forward"
Compute > RDS: "Read/Write Queries"
Compute > Storage: "Asset Upload"
`,
  },
];

export function DslPanel() {
  const { isDslOpen, setIsDslOpen, setGraphFromDsl } = useDiagramStore();
  const [dslCode, setDslCode] = useState(PRESETS[0].code);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { fitView } = useReactFlow();

  if (!isDslOpen) return null;

  const handleCompile = () => {
    try {
      setErrorMsg(null);
      const parsed = parseEraserDsl(dslCode);
      if (parsed.nodes.length === 0) {
        setErrorMsg('No valid nodes or connections found in the script.');
        return;
      }
      const layouted = layoutGraphWithDagre(parsed.nodes, parsed.edges, parsed.direction);
      setGraphFromDsl(layouted.nodes, layouted.edges);
      setTimeout(() => fitView({ duration: 500 }), 100);
    } catch (err: unknown) {
      console.error('Failed to compile DSL:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Syntax error in DSL code.');
    }
  };

  return (
    <div className="absolute right-0 top-14 bottom-0 w-96 md:w-[460px] bg-white border-l border-slate-200/90 shadow-2xl z-30 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Code2 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Diagram-as-Code</h2>
            <p className="text-[11px] text-slate-500">Eraser DSL compiler & layout engine</p>
          </div>
        </div>

        <button
          onClick={() => setIsDslOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Preset Selector */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
          Presets:
        </span>
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => setDslCode(preset.code)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Code Editor */}
      <div className="flex-1 p-3 flex flex-col min-h-0 bg-[#0F172A]">
        <textarea
          value={dslCode}
          onChange={e => setDslCode(e.target.value)}
          placeholder={`direction right\nClient [icon: react] > API [icon: nodejs]: "REST"\nAPI > Database [icon: postgresql]: "SQL"`}
          className="w-full flex-1 bg-transparent text-emerald-400 font-mono text-xs leading-relaxed outline-none resize-none p-2"
          spellCheck={false}
        />

        {errorMsg && (
          <div className="mt-2 p-2 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-[11px]">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <BookOpen size={13} />
          <span>Supports: [icon: ...], &gt;, &lt;, &lt;&gt;, --</span>
        </div>

        <button
          onClick={handleCompile}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Play size={13} />
          <span>Compile & Layout</span>
        </button>
      </div>
    </div>
  );
}

