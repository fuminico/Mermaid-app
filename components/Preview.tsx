
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { Theme } from '../types';
import { ArrowDownTrayIcon, PhotoIcon } from './Icons';

interface PreviewProps {
  mermaidCode: string;
  theme: Theme;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
  sequence: {
      useMaxWidth: true,
  }
});

export const Preview: React.FC<PreviewProps> = ({ mermaidCode, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  
  const mermaidId = 'mermaid-diagram';

  const renderMermaid = useCallback(async () => {
    if (!containerRef.current || !mermaidCode.trim()) {
      if (containerRef.current) containerRef.current.innerHTML = '';
      setRenderError(null);
      return;
    }

    setIsRendering(true);
    setRenderError(null);
    containerRef.current.innerHTML = `<div id="${mermaidId}"></div>`; // Prepare container

    try {
      mermaid.initialize({
          theme: theme === 'dark' ? 'dark' : 'default',
          // More specific theme variables for a cuter look
          themeVariables: {
            background: theme === 'dark' ? '#2d2d30' : '#FFF8F9',
            primaryColor: '#FFD78E',
            primaryTextColor: '#1F1F22',
            primaryBorderColor: '#FF9EBB',
            lineColor: theme === 'dark' ? '#9ED8FF' : '#FF9EBB',
            secondaryColor: '#9ED8FF',
            tertiaryColor: '#FFF8F9',
            fontSize: '16px',
            fontFamily: '"Noto Sans JP", sans-serif',
          }
      });
      const { svg } = await mermaid.render(mermaidId, mermaidCode);
      containerRef.current.innerHTML = svg;
    } catch (e: any) {
      console.error(e);
      setRenderError(e.message || '図の描画に失敗しました。Mermaidコードを確認してください。');
      containerRef.current.innerHTML = '';
    } finally {
      setIsRendering(false);
    }
  }, [mermaidCode, theme]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  const handleExport = (format: 'svg' | 'png') => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement) return;

    // Fix for foreignObject rendering in exports by inlining styles
    const styleEl = document.createElement('style');
    styleEl.innerHTML = Array.from(document.styleSheets)
        .map(s => {
            try { return Array.from(s.cssRules).map(r => r.cssText).join('\n') }
            catch(e) { return '' }
        }).join('\n');
    svgElement.insertBefore(styleEl, svgElement.firstChild);

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    if (format === 'svg') {
      link.download = 'diagram.svg';
      link.click();
      URL.revokeObjectURL(url);
    } else { // PNG
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Add padding for better aesthetics
        const padding = 20;
        canvas.width = img.width + padding * 2;
        canvas.height = img.height + padding * 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = theme === 'dark' ? '#1F1F22' : '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, padding, padding);
          const pngUrl = canvas.toDataURL('image/png');
          link.href = pngUrl;
          link.download = 'diagram.png';
          link.click();
          URL.revokeObjectURL(pngUrl);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
    // Clean up the added style element after export
    svgElement.removeChild(styleEl);
  };

  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-4">
      <div className="flex-grow relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-auto p-4">
        {isRendering && <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50"><p>描画中...</p></div>}
        <div ref={containerRef} className="w-full h-full flex items-center justify-center"></div>
        {!mermaidCode.trim() && !renderError && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-gray-400 dark:text-gray-500">
            <p>ここにプレビューが表示されます</p>
          </div>
        )}
        {renderError && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-red-500 p-4">
            <p className="font-bold">描画エラー:</p>
            <p className="text-sm">{renderError}</p>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button onClick={() => handleExport('svg')} className="flex items-center gap-2 px-4 py-2 bg-[#9ED8FF] text-white rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105">
          <ArrowDownTrayIcon className="w-5 h-5" /> SVG
        </button>
        <button onClick={() => handleExport('png')} className="flex items-center gap-2 px-4 py-2 bg-[#9ED8FF] text-white rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105">
          <PhotoIcon className="w-5 h-5" /> PNG
        </button>
      </div>
    </div>
  );
};
