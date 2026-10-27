import React from 'react';
import {
  BookOpen,
  Award,
  ChefHat,
  FileDown,
  Flame,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Utensils,
  Layers,
  Thermometer,
} from 'lucide-react';
import { NavTab } from './TopNavbar';
import { soundManager } from '../utils/audio';

interface OverviewViewProps {
  studentName: string;
  studentId: string;
  masteredCount: number;
  totalFlashcards: number;
  quizScore: number | null;
  onSelectTab: (tab: NavTab) => void;
  onOpenProfile: () => void;
  onOpenPdf: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  studentName,
  studentId,
  masteredCount,
  totalFlashcards,
  quizScore,
  onSelectTab,
  onOpenProfile,
  onOpenPdf,
}) => {
  const flashcardPct = Math.round((masteredCount / totalFlashcards) * 100);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-slate-900 text-white p-8 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs text-amber-200 tracking-wide font-medium">
            <span>中餐烹調技術課程</span>
            <span aria-hidden="true">·</span>
            <span>第2章 食物烹調作業</span>
            <span aria-hidden="true">·</span>
            <span>互動自學與檢定平台</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            歡迎進入中餐烹調數位學堂
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed max-w-2xl">
            完整收錄第2章全部核心知識：刀工技術與尺寸規範、加熱方式與鍋具材質、以油與水為媒介之經典烹調法、前處理與後處理工藝，搭配音效模擬測驗與實務情境分析。
          </p>

          {/* Student Status Bar in Hero */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={onOpenProfile}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="text-amber-200">當前學員：</span>
              <span className="font-bold text-white">{studentName}</span>
              <span className="text-amber-300">({studentId})</span>
              <span className="underline text-[11px] text-amber-200 ml-1">修改</span>
            </button>

            <span className="text-white/40">|</span>

            <span className="text-amber-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>字卡已熟記 {masteredCount}/{totalFlashcards} 組 ({flashcardPct}%)</span>
            </span>

            {quizScore !== null && (
              <>
                <span className="text-white/40">|</span>
                <span className="text-amber-100 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>最新測驗：{quizScore} 分</span>
                </span>
              </>
            )}
          </div>

          {/* Primary Quick CTAs */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => {
                soundManager.playFlip();
                onSelectTab('flashcards');
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-amber-50 shadow-md transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>複習學習字卡</span>
            </button>
            <button
              onClick={() => {
                soundManager.playFlip();
                onSelectTab('quiz');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-amber-400/30"
            >
              <Award className="w-4 h-4" />
              <span>開始模擬測驗（附答題音效）</span>
            </button>
            <button
              onClick={() => {
                soundManager.playFlip();
                onOpenPdf();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-amber-200 font-semibold text-xs border border-white/10 transition-all flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              <span>輸出 PDF 學習報告</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Feature Gateways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gateway 1: Flashcards */}
        <div
          onClick={() => {
            soundManager.playFlip();
            onSelectTab('flashcards');
          }}
          className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors">
                學習字卡 (Flashcards)
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                涵蓋刀工六大作用、肉品順逆紋、中餐考照丁末尺寸、黑鐵鍋養鍋、油炸七法等精華雙面卡片。
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>開始翻卡背誦</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Gateway 2: Quiz */}
        <div
          onClick={() => {
            soundManager.playFlip();
            onSelectTab('quiz');
          }}
          className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors">
                模擬測驗 (Mock Exam)
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                25題高仿真檢定考題，提供自製 Web Audio 答題音效反饋，支援練習模式與計分檢定模式。
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>進入考場測驗</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Gateway 3: Scenario Analysis */}
        <div
          onClick={() => {
            soundManager.playFlip();
            onSelectTab('scenarios');
          }}
          className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors">
                情境分析 (Scenario Studies)
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                5大主廚實務個案：黑鐵鍋防沾油膜除蠟、考照刀工檢驗、宴席油炸油溫調配、微波鋁鍋安全。
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>開始實務決策</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Curriculum Sections Reference Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            第2章 課程五大核心單元綱要
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            各單元重點均已完整納入字卡與試題體系，供學員反覆精進。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-amber-700" />
              第 1 節 刀工技術
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              意義作用、適應烹調需要（爆炒薄細、燉燜大厚）、老肉逆紋/嫩肉順紋/豬肉斜紋/魚肉切粗、廚房三把刀、生熟砧板分離、丁(0.8~1.2cm)、末(0.3cm以下)。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-700" />
              第 2 節 食物的加熱法與用具
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              傳熱三方式（傳導、對流、輻射）、熱媒分類、四大火力（旺中xml微火）、瓦斯爐五部結構、銅鋁鐵不鏽鋼導熱比熱、黑鐵鍋養鍋法、微波爐禁用金屬。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-700" />
              第 3 節 食物的烹調法
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              初熱處理（焯水/煮/油處理/蒸氣）、油量比（大5~6倍/中2倍/少20%）、七種油炸、溫油熱油旺油判別、爆炒七法、貼與塌、掛絲與掛霜、蒸煮燉燒汆燙涮、低溫烹調(50~80℃)。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-700" />
              第 4 節 食材的搭配與盤飾
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              搭配五原則：量（主料大於副料）、色（襯托不雜）、香與味（濃淡互補）、形（副隨主如片配片）、口感；盛器象牙白為主，六大擺盤手法（排堆疊圍擺覆）。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              第 5 節 廚師的職業道德
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              良好衛生觀念、好的服務品質、要有倫理觀念、顧客第一；落實食品安全標準防範交叉污染。
            </p>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/60 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <FileDown className="w-4 h-4 text-amber-700" />
                結業成果 PDF 證書輸出
              </div>
              <p className="text-amber-800 leading-relaxed text-[11px] mt-1">
                完成學習後可一鍵產出正式學習成效報告書與評核證明，供列印或電子檔備查。
              </p>
            </div>
            <button
              onClick={onOpenPdf}
              className="text-xs font-bold text-amber-900 underline text-left hover:text-amber-700"
            >
              預覽 PDF 樣式 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
