import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  Clock,
  ArrowRight,
  ArrowLeft,
  Volume2,
  FileDown,
  Check,
  AlertCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/courseData';
import { soundManager } from '../utils/audio';

export interface QuizResultRecord {
  score: number;
  totalQuestions: number;
  accuracy: number;
  completedAt: string;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
  userAnswers: { questionId: string; selectedAnswer: number; isCorrect: boolean }[];
}

interface QuizViewProps {
  studentName: string;
  studentId: string;
  onSaveQuizResult: (result: QuizResultRecord) => void;
  onOpenPdf: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  studentName,
  studentId,
  onSaveQuizResult,
  onOpenPdf,
}) => {
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [examResult, setExamResult] = useState<QuizResultRecord | null>(null);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const isPracticeSubmitted = submittedAnswers[currentIndex] === true;

  // Handle option select in practice mode (instant answer + sound effect)
  const handleSelectPracticeOption = (optionIndex: number) => {
    if (isPracticeSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
    setSubmittedAnswers((prev) => ({
      ...prev,
      [currentIndex]: true,
    }));

    if (optionIndex === currentQ.correctAnswer) {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }
  };

  // Handle option select in exam mode
  const handleSelectExamOption = (optionIndex: number) => {
    if (isExamFinished) return;
    soundManager.playClickSound();
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  // Finish exam and calculate score
  const handleFinishExam = () => {
    let correctCount = 0;
    const categoryStats: Record<string, { correct: number; total: number }> = {};
    const answersList: { questionId: string; selectedAnswer: number; isCorrect: boolean }[] = [];

    QUIZ_QUESTIONS.forEach((q, idx) => {
      const userChoice = selectedAnswers[idx] ?? -1;
      const isCorrect = userChoice === q.correctAnswer;
      if (isCorrect) correctCount++;

      if (!categoryStats[q.categoryLabel]) {
        categoryStats[q.categoryLabel] = { correct: 0, total: 0 };
      }
      categoryStats[q.categoryLabel].total++;
      if (isCorrect) categoryStats[q.categoryLabel].correct++;

      answersList.push({
        questionId: q.id,
        selectedAnswer: userChoice,
        isCorrect,
      });
    });

    const score = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    const accuracy = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

    const resultData: QuizResultRecord = {
      score,
      totalQuestions: QUIZ_QUESTIONS.length,
      accuracy,
      completedAt: new Date().toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      categoryBreakdown: categoryStats,
      userAnswers: answersList,
    };

    setExamResult(resultData);
    setIsExamFinished(true);
    onSaveQuizResult(resultData);

    // Audio & Visual Fanfare
    soundManager.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Reset quiz
  const handleResetQuiz = () => {
    soundManager.playFlip();
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setIsExamFinished(false);
    setExamResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Header & Mode Selector */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>第2章 食物烹調作業</span>
              <span aria-hidden="true">·</span>
              <span>全真模擬檢定題庫</span>
              <span aria-hidden="true">·</span>
              <span>共 {QUIZ_QUESTIONS.length} 題</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              模擬測驗 (Mock Quiz & Examination)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              作答支援即時答題音效反饋，可切換單題即時解析練習或全真計分檢定模式。
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => {
                if (mode !== 'practice') {
                  setMode('practice');
                  handleResetQuiz();
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                mode === 'practice'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              單題即時解析練習
            </button>
            <button
              onClick={() => {
                if (mode !== 'exam') {
                  setMode('exam');
                  handleResetQuiz();
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                mode === 'exam'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全真計分檢定考
            </button>
          </div>
        </div>

        {/* Progress & Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              第 {currentIndex + 1} 題 / 共 {QUIZ_QUESTIONS.length} 題
            </span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-medium text-[11px]">
              {currentQ.categoryLabel}
            </span>
          </div>

          {/* Quick jump circles */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[50%] py-1">
            {QUIZ_QUESTIONS.map((_, i) => {
              const isAns = selectedAnswers[i] !== undefined;
              const isCurr = currentIndex === i;
              return (
                <button
                  key={i}
                  onClick={() => {
                    soundManager.playFlip();
                    setCurrentIndex(i);
                  }}
                  className={`w-6 h-6 rounded-md text-[11px] font-semibold transition-colors shrink-0 ${
                    isCurr
                      ? 'bg-amber-600 text-white shadow-xs'
                      : isAns
                      ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Question Card (When not finished exam) */}
      {!isExamFinished ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-amber-700 tracking-wide uppercase">
              Question {currentIndex + 1}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              const isCorrectOpt = optIdx === currentQ.correctAnswer;

              let optionStyle =
                'border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 text-slate-800 bg-white';

              if (mode === 'practice' && isPracticeSubmitted) {
                if (isCorrectOpt) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-medium';
                } else if (isSelected) {
                  optionStyle = 'border-rose-400 bg-rose-50/80 text-rose-900';
                } else {
                  optionStyle = 'border-slate-200 text-slate-400 opacity-60 bg-white';
                }
              } else if (mode === 'exam' && isSelected) {
                optionStyle = 'border-amber-600 bg-amber-50/60 text-amber-900 font-semibold ring-1 ring-amber-500';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => {
                    if (mode === 'practice') {
                      handleSelectPracticeOption(optIdx);
                    } else {
                      handleSelectExamOption(optIdx);
                    }
                  }}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${optionStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      mode === 'practice' && isPracticeSubmitted
                        ? isCorrectOpt
                          ? 'bg-emerald-600 text-white'
                          : isSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                        : isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <div className="flex-1 text-sm sm:text-base leading-snug">
                    {option}
                  </div>
                  {mode === 'practice' && isPracticeSubmitted && (
                    <div className="shrink-0 mt-0.5">
                      {isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {!isCorrectOpt && isSelected && <XCircle className="w-5 h-5 text-rose-600" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Practice Mode Explanation Box */}
          {mode === 'practice' && isPracticeSubmitted && (
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2 animate-in fade-in duration-300">
              <p className="text-sm text-slate-700 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  soundManager.playFlip();
                  setCurrentIndex(currentIndex - 1);
                }
              }}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              上一題
            </button>

            <div className="flex items-center gap-2">
              {currentIndex < QUIZ_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => {
                    soundManager.playFlip();
                    setCurrentIndex(currentIndex + 1);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
                >
                  下一題
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : mode === 'exam' ? (
                <button
                  onClick={handleFinishExam}
                  className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-md transition-colors"
                >
                  <Award className="w-4 h-4" />
                  交卷結算成績
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新開始練習
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Exam Result View */
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-xs space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-lg mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              模擬檢定測驗結算完畢！
            </h2>
            <p className="text-xs text-slate-500">
              學員：{studentName}（學號：{studentId}）· 完成時間：{examResult?.completedAt}
            </p>

            {/* Score Big Display */}
            <div className="py-4">
              <div className="text-5xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {examResult?.score}
                <span className="text-lg font-medium text-slate-500 ml-1">分</span>
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">
                正確答對 {examResult?.userAnswers.filter((a) => a.isCorrect).length} 題 / 共 {examResult?.totalQuestions} 題（正確率 {examResult?.accuracy}%）
              </div>
            </div>

            {/* Assessment Label */}
            <div className="inline-block px-4 py-1.5 bg-amber-50 text-amber-900 text-xs font-bold rounded-full border border-amber-200">
              {examResult && examResult.score >= 90
                ? '評級：特優 (Master Chef Ready)'
                : examResult && examResult.score >= 80
                ? '評級：優等 (Passed with Honors)'
                : examResult && examResult.score >= 60
                ? '評級：合格 (Pass Standard)'
                : '評級：待加強 (Need Revision)'}
            </div>
          </div>

          {/* Category Breakdown Table */}
          {examResult && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-xs font-bold text-slate-700">
                各單元答題掌握度分析
              </div>
              <div className="divide-y divide-slate-100">
                {Object.entries(examResult.categoryBreakdown).map(([cat, stats]) => {
                  const pct = Math.round((stats.correct / stats.total) * 100);
                  return (
                    <div key={cat} className="px-4 py-3 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{cat}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 tabular-nums">
                          {stats.correct} / {stats.total} 題
                        </span>
                        <span
                          className={`font-bold tabular-nums w-12 text-right ${
                            pct >= 80 ? 'text-emerald-700' : pct >= 60 ? 'text-amber-700' : 'text-rose-600'
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playFlip();
                onOpenPdf();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              <FileDown className="w-4 h-4" />
              輸出成績證明 PDF
            </button>
            <button
              onClick={handleResetQuiz}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              再測一次
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
