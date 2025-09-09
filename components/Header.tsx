
import React from 'react';
import { DiagramType, Theme } from '../types';
import { DIAGRAM_TYPE_OPTIONS } from '../constants';
import { SunIcon, MoonIcon, DiagramIcon } from './Icons';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  diagramType: DiagramType;
  setDiagramType: (type: DiagramType) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, diagramType, setDiagramType }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <DiagramIcon className="w-10 h-10 text-[#FF9EBB]" />
        <h1 className="text-2xl font-display text-transparent bg-clip-text bg-gradient-to-r from-[#FF9EBB] to-[#FFD78E]">
          Mermaidずこうしつ
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={diagramType}
          onChange={(e) => setDiagramType(e.target.value as DiagramType)}
          className="bg-white/80 dark:bg-gray-700/80 border border-transparent focus:ring-2 focus:ring-[#9ED8FF] focus:border-[#9ED8FF] rounded-lg px-3 py-2 transition-all duration-200 shadow-sm appearance-none"
        >
          {DIAGRAM_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-[#FFD78E] text-white hover:bg-opacity-90 transition-all duration-200 transform hover:scale-110"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};
