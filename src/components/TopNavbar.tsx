import React from 'react';
import { Volume2, VolumeX, FileDown, User, UtensilsCrossed } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type NavTab = 'overview' | 'flashcards' | 'quiz' | 'scenarios';

interface TopNavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  studentId: string;
  studentName: string;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenProfile: () => void;
  onOpenPdf: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onSelectTab,
  studentId,
  studentName,
  isMuted,
  onToggleSound,
  onOpenProfile,
  onOpenPdf,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundManager.playFlip();
              onSelectTab('overview');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:bg-amber-700 transition-colors">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                中餐烹調作業
              </span>
              <span className="text-[11px] text-amber-700 font-medium tracking-wide">
                食物烹調技術數位學堂
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 shrink-0">
          <button
            onClick={() => {
              soundManager.playFlip();
              onSelectTab('overview');
            }}
            className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
              currentTab === 'overview'
                ? 'border-amber-600 text-amber-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            單元總覽
          </button>
          <button
            onClick={() => {
              soundManager.playFlip();
              onSelectTab('flashcards');
            }}
            className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
              currentTab === 'flashcards'
                ? 'border-amber-600 text-amber-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            學習字卡
          </button>
          <button
            onClick={() => {
              soundManager.playFlip();
              onSelectTab('quiz');
            }}
            className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
              currentTab === 'quiz'
                ? 'border-amber-600 text-amber-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            模擬測驗
          </button>
          <button
            onClick={() => {
              soundManager.playFlip();
              onSelectTab('scenarios');
            }}
            className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
              currentTab === 'scenarios'
                ? 'border-amber-600 text-amber-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            情境分析
          </button>
        </nav>

        {/* Zone 3: 1 primary action + interactive controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sound Effect Toggle Button */}
          <button
            onClick={onToggleSound}
            title={isMuted ? '已靜音（點擊開啟答題音效）' : '音效已開啟（點擊靜音）'}
            aria-label="答題音效開關"
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isMuted
                ? 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />}
            <span className="hidden sm:inline whitespace-nowrap text-xs">
              {isMuted ? '音效關閉' : '答題音效'}
            </span>
          </button>

          {/* Student Badge / Profile Trigger */}
          <button
            onClick={onOpenProfile}
            title="點擊修改學生學號與姓名"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-xs font-medium border border-slate-200/80 transition-colors shrink-0"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-900 max-w-[80px] truncate">{studentName}</span>
            <span className="text-slate-400 text-[11px] hidden lg:inline">({studentId})</span>
          </button>

          {/* PDF Export Action Button */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onOpenPdf();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF 輸出</span>
          </button>
        </div>
      </div>

      {/* Mobile Subnav Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 px-2 py-1.5 bg-slate-50 text-xs">
        <button
          onClick={() => {
            soundManager.playFlip();
            onSelectTab('overview');
          }}
          className={`py-1 px-2 font-medium rounded ${
            currentTab === 'overview' ? 'text-amber-800 font-bold bg-amber-100/70' : 'text-slate-600'
          }`}
        >
          總覽
        </button>
        <button
          onClick={() => {
            soundManager.playFlip();
            onSelectTab('flashcards');
          }}
          className={`py-1 px-2 font-medium rounded ${
            currentTab === 'flashcards' ? 'text-amber-800 font-bold bg-amber-100/70' : 'text-slate-600'
          }`}
        >
          字卡
        </button>
        <button
          onClick={() => {
            soundManager.playFlip();
            onSelectTab('quiz');
          }}
          className={`py-1 px-2 font-medium rounded ${
            currentTab === 'quiz' ? 'text-amber-800 font-bold bg-amber-100/70' : 'text-slate-600'
          }`}
        >
          測驗
        </button>
        <button
          onClick={() => {
            soundManager.playFlip();
            onSelectTab('scenarios');
          }}
          className={`py-1 px-2 font-medium rounded ${
            currentTab === 'scenarios' ? 'text-amber-800 font-bold bg-amber-100/70' : 'text-slate-600'
          }`}
        >
          情境分析
        </button>
      </div>
    </header>
  );
};
