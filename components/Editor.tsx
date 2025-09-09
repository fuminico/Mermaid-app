
import React, { useState } from 'react';
import { DiagramType } from '../types';
import { MagicWandIcon, CodeBracketIcon, DocumentTextIcon } from './Icons';
import { Spinner } from './Spinner';

interface EditorProps {
  naturalText: string;
  setNaturalText: (text: string) => void;
  mermaidCode: string;
  setMermaidCode: (code: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  diagramType: DiagramType;
}

type EditorTab = 'natural' | 'mermaid';

export const Editor: React.FC<EditorProps> = ({ naturalText, setNaturalText, mermaidCode, setMermaidCode, onGenerate, isLoading }) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('natural');

  const TabButton = ({ tab, icon, label }: { tab: EditorTab; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg transition-colors duration-200 ${
        activeTab === tab 
          ? 'bg-[#FFF8F9] dark:bg-[#2d2d30] text-[#FF9EBB] border-b-2 border-[#FF9EBB]'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white/80 dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden p-1">
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-2 pt-1">
        <TabButton tab="natural" icon={<DocumentTextIcon className="w-5 h-5" />} label="テキスト入力" />
        <TabButton tab="mermaid" icon={<CodeBracketIcon className="w-5 h-5" />} label="Mermaidコード" />
      </div>

      <div className="flex-grow p-3 overflow-y-auto">
        {activeTab === 'natural' ? (
          <textarea
            value={naturalText}
            onChange={(e) => setNaturalText(e.target.value)}
            placeholder="ここに手順やタスクを書いてください..."
            className="w-full h-full p-3 bg-transparent text-[#1F1F22] dark:text-[#FFF8F9] resize-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />
        ) : (
          <textarea
            value={mermaidCode}
            onChange={(e) => setMermaidCode(e.target.value)}
            placeholder="ここにMermaidコードが表示されます..."
            className="w-full h-full p-3 bg-transparent text-[#1F1F22] dark:text-[#FFF8F9] resize-none focus:outline-none font-mono text-sm"
          />
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[#FF9EBB] to-[#FFD78E] text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>生成中...</span>
            </>
          ) : (
            <>
              <MagicWandIcon className="w-6 h-6" />
              <span>図を生成する</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
