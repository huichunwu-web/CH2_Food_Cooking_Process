import React, { useState } from 'react';
import { ChefHat, CheckCircle, AlertTriangle, ArrowRight, RotateCcw, Award, Lightbulb } from 'lucide-react';
import { SCENARIO_CASES, ScenarioCase } from '../data/courseData';
import { soundManager } from '../utils/audio';

interface ScenarioViewProps {
  studentName: string;
  studentId: string;
  onOpenPdf: () => void;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  studentName,
  studentId,
  onOpenPdf,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [caseScores, setCaseScores] = useState<Record<string, number[]>>({});
  const [isCaseCompleted, setIsCaseCompleted] = useState(false);

  const activeCase = SCENARIO_CASES[selectedCaseIndex];
  const activeStep = activeCase.steps[currentStepIndex];

  const handleSelectOption = (optIdx: number) => {
    if (selectedOptionIndex !== null) return;
    setSelectedOptionIndex(optIdx);

    const chosen = activeStep.options[optIdx];
    if (chosen.isOptimal) {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }

    setCaseScores((prev) => {
      const existing = prev[activeCase.id] || [];
      const updated = [...existing];
      updated[currentStepIndex] = chosen.score;
      return { ...prev, [activeCase.id]: updated };
    });
  };

  const handleNextStep = () => {
    soundManager.playFlip();
    if (currentStepIndex < activeCase.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setSelectedOptionIndex(null);
    } else {
      setIsCaseCompleted(true);
      soundManager.playFanfare();
    }
  };

  const handleResetCase = () => {
    soundManager.playFlip();
    setCurrentStepIndex(0);
    setSelectedOptionIndex(null);
    setIsCaseCompleted(false);
    setCaseScores((prev) => ({
      ...prev,
      [activeCase.id]: [],
    }));
  };

  const currentScores = caseScores[activeCase.id] || [];
  const totalScore = currentScores.reduce((a, b) => a + b, 0);
  const maxPossibleScore = activeCase.steps.length * 25;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>第2章 食物烹調作業</span>
              <span aria-hidden="true">·</span>
              <span>廚房實務決策與疑難排解</span>
              <span aria-hidden="true">·</span>
              <span>共 5 大情境</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              情境分析 (Culinary Scenario Case Studies)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              沉浸式體驗中餐廚房真實營運與考照現場，做出最佳廚藝決策並獲得主廚評核反饋。
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs text-slate-600 shrink-0">
            <ChefHat className="w-4 h-4 text-amber-700" />
            <span>主廚評核導師在線指導</span>
          </div>
        </div>

        {/* Case Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {SCENARIO_CASES.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playFlip();
                setSelectedCaseIndex(idx);
                setCurrentStepIndex(0);
                setSelectedOptionIndex(null);
                setIsCaseCompleted(false);
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCaseIndex === idx
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              情境 {idx + 1}：{item.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Case Details Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Case Title & Context */}
        <div className="space-y-3 border-b border-slate-100 pb-5">
          <div className="text-xs font-semibold text-amber-800 tracking-wide">
            {activeCase.subtitle}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {activeCase.title}
          </h2>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              情境背景與挑戰問題
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              {activeCase.background}
            </p>
            <div className="text-xs font-semibold text-amber-900 pt-1">
              🎯 核心任務：{activeCase.task}
            </div>
          </div>
        </div>

        {/* Interactive Step Card */}
        {!isCaseCompleted ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                步驟 {currentStepIndex + 1} / {activeCase.steps.length}：{activeStep.stepTitle}
              </span>
              <span className="text-slate-500 font-mono">
                當前得分: {totalScore} / {maxPossibleScore} 分
              </span>
            </div>

            <div className="text-sm font-semibold text-slate-900 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              {activeStep.prompt}
            </div>

            {/* Decision Options */}
            <div className="space-y-3">
              {activeStep.options.map((opt, optIdx) => {
                const isSelected = selectedOptionIndex === optIdx;
                let cardStyle =
                  'border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 text-slate-800 bg-white';

                if (selectedOptionIndex !== null) {
                  if (opt.isOptimal) {
                    cardStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium';
                  } else if (isSelected) {
                    cardStyle = 'border-rose-400 bg-rose-50/70 text-rose-950';
                  } else {
                    cardStyle = 'border-slate-200 text-slate-400 opacity-60 bg-white';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={selectedOptionIndex !== null}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${cardStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <div className="text-xs sm:text-sm leading-relaxed flex-1">
                        {opt.text}
                      </div>
                    </div>

                    {/* Feedback displayed after selection */}
                    {selectedOptionIndex !== null && isSelected && (
                      <div
                        className={`mt-2 pt-2 border-t text-xs flex items-start gap-1.5 ${
                          opt.isOptimal ? 'text-emerald-800 border-emerald-200' : 'text-rose-800 border-rose-200'
                        }`}
                      >
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">評核意見（+{opt.score}分）：</span>
                          <span>{opt.feedback}</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Step Control */}
            {selectedOptionIndex !== null && (
              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
                >
                  <span>
                    {currentStepIndex < activeCase.steps.length - 1 ? '進入下一步驟' : '完成情境評定'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Case Completed View */
          <div className="p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  情境決策評核完成！
                </h3>
                <p className="text-xs text-slate-500">
                  學員：{studentName}（{studentId}）· 本情境總分：{totalScore} / {maxPossibleScore} 分
                </p>
              </div>
            </div>

            {/* Master Chef Summary */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-amber-700" />
                主廚權威總結
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeCase.expertSummary}
              </p>
            </div>

            {/* Core Principles Review */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800">本情境核心技術重點回顧：</div>
              <div className="space-y-1.5">
                {activeCase.corePrinciples.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleResetCase}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重新演練本情境
              </button>
              {selectedCaseIndex < SCENARIO_CASES.length - 1 && (
                <button
                  onClick={() => {
                    soundManager.playFlip();
                    setSelectedCaseIndex(selectedCaseIndex + 1);
                    setCurrentStepIndex(0);
                    setSelectedOptionIndex(null);
                    setIsCaseCompleted(false);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  前往下一個情境
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
