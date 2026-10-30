'use client';

import React, { useState } from 'react';
import { useDiagramStore } from '@/lib/store/diagramStore';
import { X, Image, FileCode, Upload, Download, Check, AlertTriangle } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';

export function ExportModal() {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    currentDiagram,
    nodes,
    importDiagramJson,
  } = useDiagramStore();

  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'json'>('png');
  const [backgroundType, setBackgroundType] = useState<'white' | 'transparent'>('white');
  const [scale, setScale] = useState<number>(2); // 2x Retina
  const [isExporting, setIsExporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isExportModalOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const diagramTitle = currentDiagram?.title?.toLowerCase().replace(/\s+/g, '-') || 'architecture-diagram';

      if (exportFormat === 'json') {
        const jsonContent = JSON.stringify(currentDiagram, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${diagramTitle}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExportModalOpen(false);
        return;
      }

      // Query the react-flow viewport element
      const flowElement = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!flowElement) {
        throw new Error('Canvas viewport element not found');
      }

      const bounds = getNodesBounds(nodes);
      const padding = 60;
      const width = bounds.width + padding * 2;
      const height = bounds.height + padding * 2;

      const options = {
        backgroundColor: backgroundType === 'white' ? '#FFFFFF' : undefined,
        width: width,
        height: height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${-bounds.x + padding}px, ${-bounds.y + padding}px) scale(1)`,
        },
        pixelRatio: scale,
      };

      if (exportFormat === 'png') {
        const dataUrl = await toPng(flowElement, options);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${diagramTitle}@${scale}x.png`;
        a.click();
      } else if (exportFormat === 'svg') {
        const dataUrl = await toSvg(flowElement, options);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${diagramTitle}.svg`;
        a.click();
      }

      setIsExportModalOpen(false);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export diagram. Please ensure all nodes are visible.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = importDiagramJson(content);
      if (success) {
        setImportStatus('Successfully imported diagram!');
        setTimeout(() => {
          setIsExportModalOpen(false);
          setImportStatus(null);
        }, 800);
      } else {
        setImportStatus('Invalid JSON document schema. Please upload a valid diagram file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Export & Exchange</h2>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setExportFormat('png')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  exportFormat === 'png'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Image size={18} />
                <span>PNG Image</span>
              </button>
              <button
                onClick={() => setExportFormat('svg')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  exportFormat === 'svg'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileCode size={18} />
                <span>SVG Vector</span>
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  exportFormat === 'json'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Download size={18} />
                <span>JSON Document</span>
              </button>
            </div>
          </div>

          {/* Options for Image Export */}
          {exportFormat !== 'json' && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block">Background</span>
                <span className="text-[11px] text-slate-500">Canvas fill color</span>
              </div>
              <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setBackgroundType('white')}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    backgroundType === 'white' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Solid White
                </button>
                <button
                  onClick={() => setBackgroundType('transparent')}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    backgroundType === 'transparent' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Transparent
                </button>
              </div>
            </div>
          )}

          {/* Export Action */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <span>Generating {exportFormat.toUpperCase()}...</span>
            ) : (
              <>
                <Download size={15} />
                <span>Download {exportFormat.toUpperCase()}</span>
              </>
            )}
          </button>

          <div className="h-px bg-slate-200 my-1" />

          {/* Import JSON Source */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Import Diagram (JSON)
            </label>
            <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all text-xs font-medium text-slate-600">
              <Upload size={16} className="text-slate-500" />
              <span>Choose JSON file to import</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {importStatus && (
              <p className={`text-[11px] mt-1.5 font-medium ${
                importStatus.includes('Success') ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {importStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

