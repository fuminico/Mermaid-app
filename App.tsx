
import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Header } from './components/Header';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DiagramType, Theme } from './types';
import { generateMermaidCode } from './services/geminiService';
import { TEMPLATES } from './constants';
import { ArrowPathIcon, ExclamationTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [diagramType, setDiagramType] = useLocalStorage<DiagramType>('diagramType', DiagramType.Flowchart);
  const [naturalText, setNaturalText] = useLocalStorage<string>('naturalText', TEMPLATES[DiagramType.Flowchart]);
  const [mermaidCode, setMermaidCode] = useLocalStorage<string>('mermaidCode', '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleGenerate = useCallback(async () => {
    if (!naturalText.trim()) {
      setError("テキストを入力してください。");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const code = await generateMermaidCode(naturalText, diagramType);
      setMermaidCode(code);
    } catch (err) {
      console.error(err);
      setError("図の生成に失敗しました。時間をおいて再試行してください。");
    } finally {
      setIsLoading(false);
    }
  }, [naturalText, diagramType, setMermaidCode]);

  const handleDiagramTypeChange = (newType: DiagramType) => {
    if(diagramType !== newType) {
        setDiagramType(newType);
        setNaturalText(TEMPLATES[newType]);
        setMermaidCode(''); // Clear old diagram
        setError(null);
    }
  };
  
  const handleReset = () => {
    setNaturalText(TEMPLATES[diagramType]);
    setMermaidCode('');
    setError(null);
  };

  if (!isClient) {
    return null; // Avoid rendering on server to prevent hydration mismatch with localStorage
  }

  return (
    <div className={`flex flex-col h-screen bg-[#FFF8F9] dark:bg-[#1F1F22] text-[#1F1F22] dark:text-[#FFF8F9] transition-colors duration-300`}>
      <Header
        theme={theme}
        setTheme={setTheme}
        diagramType={diagramType}
        setDiagramType={handleDiagramTypeChange}
      />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        <Editor
          naturalText={naturalText}
          setNaturalText={setNaturalText}
          mermaidCode={mermaidCode}
          setMermaidCode={setMermaidCode}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          diagramType={diagramType}
        />
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-display text-[#FF9EBB] dark:text-[#FFD78E]">プレビュー</h2>
            <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1 bg-[#FFD78E] text-white rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                title="現在の入力をリセット"
            >
                <ArrowPathIcon className="w-4 h-4" />
                <span>リセット</span>
            </button>
          </div>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg mb-2 flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">おっと！</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          <Preview mermaidCode={mermaidCode} theme={theme} />
        </div>
      </main>
    </div>
  );
};

export default App;
