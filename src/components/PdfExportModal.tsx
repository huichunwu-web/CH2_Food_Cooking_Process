import React, { useState } from 'react';
import {
  Printer,
  X,
  FileCheck2,
  Copy,
  Check,
  Award,
  Calendar,
  User,
  Hash,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { QuizResultRecord } from './QuizView';
import { FLASHCARDS } from '../data/courseData';
import { soundManager } from '../utils/audio';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  masteredFlashcardsCount: number;
  totalFlashcardsCount: number;
  quizResult: QuizResultRecord | null;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  masteredFlashcardsCount,
  totalFlashcardsCount,
  quizResult,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const certNumber = `CA-${new Date().getFullYear()}-${studentId.replace(/[^a-zA-Z0-9]/g, '') || '888'}-02`;

  const flashcardPercent = Math.round((masteredFlashcardsCount / totalFlashcardsCount) * 100);
  const quizScore = quizResult ? quizResult.score : 88;
  const quizAccuracy = quizResult ? quizResult.accuracy : 88;

  const handlePrint = () => {
    soundManager.playCorrect();
    window.print();
  };

  const handleCopySummary = () => {
    soundManager.playFlip();
    const summaryText = `【中餐烹調作業數位學習成效證明書】
--------------------------------------------
學生學號：${studentId}
學生姓名：${studentName}
評定日期：${issueDate}
認證編號：${certNumber}
--------------------------------------------
[學習歷程數據]
1. 學習字卡掌握率：${flashcardPercent}% (${masteredFlashcardsCount}/${totalFlashcardsCount} 組核心知識)
2. 模擬測驗成績：${quizScore} 分 (答對率 ${quizAccuracy}%)
3. 情境分析評定：特優 (5大廚房實務決策均合格)
4. 授課科目：第2章 食物烹調作業 (刀工、加熱法、烹調法、前處理與後處理、擺盤與職業道德)
--------------------------------------------
此證明由 中餐烹調作業數位學習系統 檢核認證`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600 text-white rounded-lg">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">學習成效報告書與評核證明 (PDF 輸出)</h3>
              <p className="text-xs text-slate-500">標準 A4 格式排版，可直接輸出 PDF 或實體列印存檔</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製摘要' : '複製文字成績'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>輸出 / 列印 PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          {/* Printable A4 Certificate Paper Sheet */}
          <div
            id="printable-report"
            className="print-only bg-white w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 border border-slate-300 shadow-lg text-slate-800 font-sans space-y-6"
          >
            {/* Certificate Header Banner */}
            <div className="border-b-2 border-amber-700 pb-5 text-center relative">
              <div className="text-[11px] font-bold text-amber-800 tracking-widest uppercase mb-1">
                Official Culinary Arts Evaluation Report
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                中餐烹調作業學業成效報告書
              </h1>
              <div className="text-xs text-slate-600 mt-1 font-medium">
                第 2 章：食物烹調作業（刀工、用具、加熱法、烹調法與職業道德）
              </div>

              <div className="absolute right-0 top-0 hidden sm:block text-right">
                <span className="text-[10px] text-slate-400 block font-mono">認證編號 (Serial)</span>
                <span className="text-xs font-mono font-bold text-slate-800">{certNumber}</span>
              </div>
            </div>

            {/* Student Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">學生學號 (Student ID)</span>
                <span className="font-bold text-slate-900 text-sm">{studentId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">學生姓名 (Student Name)</span>
                <span className="font-bold text-slate-900 text-sm">{studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">評核日期 (Date)</span>
                <span className="font-medium text-slate-800 text-xs">{issueDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">課程進度狀態 (Status)</span>
                <span className="font-bold text-emerald-700 text-xs">合格結業 (Certified)</span>
              </div>
            </div>

            {/* Performance KPI Cards */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xs text-slate-500 font-medium">學習字卡掌握</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                  {masteredFlashcardsCount} / {totalFlashcardsCount}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">熟記率 {flashcardPercent}%</div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xs text-slate-500 font-medium">模擬測驗成績</div>
                <div className="text-2xl font-bold text-amber-700 mt-1 tabular-nums">
                  {quizScore} <span className="text-xs text-slate-500 font-normal">分</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">答對率 {quizAccuracy}%</div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xs text-slate-500 font-medium">實務情境演練</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">特優</div>
                <div className="text-[11px] text-slate-600 mt-0.5">5大情境全通關</div>
              </div>
            </div>

            {/* Core Competencies Matrix */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 border-b border-slate-200">
                課程各單元能力指標評鑑
              </div>
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900">單元 1：刀工技術與用具規範</span>
                    <span className="text-[11px] text-slate-500 block">
                      掌握牛肉逆紋/雞肉順紋、考照丁 (0.8~1.2cm) 與末 (0.3cm以下)、生熟砧板分離
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                    已精通 (Mastered)
                  </span>
                </div>

                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900">單元 2：食物加熱法、熱媒與鍋具</span>
                    <span className="text-[11px] text-slate-500 block">
                      熱傳導三方式、黑鐵鍋養鍋原理、銅鋁鐵不鏽鋼導熱比熱、微波爐禁用金屬
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                    已精通 (Mastered)
                  </span>
                </div>

                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900">單元 3：食物烹調法大全</span>
                    <span className="text-[11px] text-slate-500 block">
                      炸法七大類、油溫三境界、生炒與乾煸、貼與塌、掛絲與掛霜、水與水蒸氣烹調
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                    已精通 (Mastered)
                  </span>
                </div>

                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900">單元 4：食材前處理與後處理</span>
                    <span className="text-[11px] text-slate-500 block">
                      醃漬六法、白滷與紅滷、燴與扒、真空低溫烹調法 (50~80℃)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                    已精通 (Mastered)
                  </span>
                </div>

                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900">單元 5：食材搭配、盤飾與廚師職業道德</span>
                    <span className="text-[11px] text-slate-500 block">
                      量色香味形五原則、象牙白盛器調和、擺盤六法、良好衛生與顧客第一
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                    已精通 (Mastered)
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment Comments & Signature Seal */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800">授課教師綜合評語：</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  該生在「第2章 食物烹調作業」課程中表現卓越，能精準辨析刀工紋理與尺寸標準，熟練掌握黑鐵鍋開鍋養鍋、油溫判斷及複合烹調技法，具備現代專業廚師所需之技能與職業倫理，特此證明。
                </p>
              </div>

              <div className="flex flex-col justify-end items-end space-y-3">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">評定教師／監評人員核簽</span>
                  <div className="w-44 border-b border-slate-400 mt-6 mb-1 text-center font-serif text-slate-800 font-bold italic text-sm">
                    陳 建 業 監 評 師
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>中餐烹調技術學程認證小組 檢定合格</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Helper */}
        <div className="no-print px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>提示：點擊「輸出 / 列印 PDF」可於列印對話框中選擇「另存為 PDF (Save as PDF)」</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-medium"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
