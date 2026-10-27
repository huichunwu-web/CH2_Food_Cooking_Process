import React, { useState, useMemo } from 'react';
import { Search, RotateCw, CheckCircle2, Circle, Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { FLASHCARDS, Flashcard } from '../data/courseData';
import { soundManager } from '../utils/audio';

interface FlashcardsViewProps {
  masteredIds: Set<string>;
  onToggleMastered: (id: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  masteredIds,
  onToggleMastered,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const categories = [
    { key: 'all', label: '全部字卡' },
    { key: 'knife', label: '刀工技術' },
    { key: 'heating', label: '鍋具與加熱法' },
    { key: 'cooking', label: '烹調技法' },
    { key: 'processing', label: '前處理與後處理' },
    { key: 'plating_ethics', label: '搭配與職業道德' },
  ];

  const filteredCards = useMemo(() => {
    return FLASHCARDS.filter((card) => {
      const matchCategory = selectedCategory === 'all' || card.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        card.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.keyPoints.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (card.classicExamples && card.classicExamples.some((ex) => ex.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFlip = (id: string) => {
    soundManager.playFlip();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSpeech = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const masteredCount = FLASHCARDS.filter((c) => masteredIds.has(c.id)).length;
  const progressPercent = Math.round((masteredCount / FLASHCARDS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>第2章 食物烹調作業</span>
              <span aria-hidden="true">·</span>
              <span>核心知識點雙面字卡</span>
              <span aria-hidden="true">·</span>
              <span>共 {FLASHCARDS.length} 組要點</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              學習字卡 (Study Flashcards)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              點擊卡片即可 3D 翻轉查看完整核心規範、規格數據、代表菜餚與考照重點。
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-lg p-3 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500">字卡掌握進度</div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {masteredCount} <span className="text-xs font-normal text-slate-500">/ {FLASHCARDS.length} 組</span>
              </div>
            </div>
            <div className="w-14 h-14 relative flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-600 transition-all duration-500"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-slate-800 tabular-nums">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Tabs (Functional Segmented Controls) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  soundManager.playFlip();
                  setSelectedCategory(cat.key);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.key
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋關鍵字，例如：養鍋、微波、丁..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-medium">沒有找到符合條件的學習字卡</p>
          <p className="text-xs text-slate-400 mt-1">請嘗試調整搜尋字詞或切換分類標籤</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => {
            const isFlipped = !!flippedCards[card.id];
            const isMastered = masteredIds.has(card.id);

            return (
              <div
                key={card.id}
                className="perspective-1000 h-[340px] cursor-pointer group"
                onClick={() => toggleFlip(card.id)}
              >
                <div
                  className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
                    <div>
                      {/* Top Bar on Card */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          <Layers className="w-3 h-3" />
                          <span>{card.categoryLabel}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundManager.playCorrect();
                            onToggleMastered(card.id);
                          }}
                          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors ${
                            isMastered
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100'
                          }`}
                          title={isMastered ? '已掌握（點擊取消）' : '標記為已掌握'}
                        >
                          {isMastered ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-medium text-[11px]">已熟記</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-3.5 h-3.5" />
                              <span className="text-[11px]">待熟記</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Card Term */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                          {card.term}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => handleSpeech(card.term, e)}
                          title="語音朗讀名詞"
                          className="text-slate-400 hover:text-amber-700 p-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {card.summary}
                      </p>

                      {/* Preview Bullet Highlights */}
                      <div className="mt-3 space-y-1.5">
                        {card.keyPoints.slice(0, 2).map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <span className="text-amber-500 font-bold shrink-0">·</span>
                            <span className="line-clamp-1">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Prompt to Flip */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>點擊卡片翻轉詳解</span>
                      <span className="flex items-center gap-1 text-amber-700 font-medium group-hover:translate-x-0.5 transition-transform">
                        <RotateCw className="w-3 h-3" />
                        <span>查看背後要點</span>
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-slate-900 text-slate-100 rounded-xl p-5 shadow-md flex flex-col justify-between border border-slate-800">
                    <div className="overflow-y-auto pr-1 space-y-2.5 max-h-[260px]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-semibold text-amber-400 tracking-wide">
                          核心規範與考照要點
                        </span>
                        <span className="text-[11px] text-slate-400">點擊翻回正面</span>
                      </div>

                      {/* Key Points List */}
                      <div className="space-y-1.5">
                        {card.keyPoints.map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-200 leading-snug">
                            <span className="text-amber-400 font-bold shrink-0">✓</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>

                      {/* Classic Examples */}
                      {card.classicExamples && card.classicExamples.length > 0 && (
                        <div className="pt-1.5 text-xs">
                          <span className="text-slate-400 text-[11px] block mb-1">代表菜餚實例：</span>
                          <div className="flex flex-wrap gap-1">
                            {card.classicExamples.map((ex, i) => (
                              <span
                                key={i}
                                className="bg-slate-800 text-amber-300 text-[11px] px-2 py-0.5 rounded border border-slate-700"
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Exam Note */}
                      {card.examNote && (
                        <div className="pt-1.5 p-2 bg-amber-950/40 border border-amber-800/60 rounded text-[11px] text-amber-200 leading-tight">
                          <span className="font-bold text-amber-300">考照注意：</span>
                          {card.examNote}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate">{card.term}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playCorrect();
                          onToggleMastered(card.id);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-medium"
                      >
                        {isMastered ? '已掌握 ✓' : '點此標為已熟記'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
