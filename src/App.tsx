import React, { useState, useEffect } from 'react';
import { TopNavbar, NavTab } from './components/TopNavbar';
import { OverviewView } from './components/OverviewView';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView, QuizResultRecord } from './components/QuizView';
import { ScenarioView } from './components/ScenarioView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { PdfExportModal } from './components/PdfExportModal';
import { FLASHCARDS } from './data/courseData';
import { soundManager } from './utils/audio';

export default function App() {
  // Student Profile State
  const [studentId, setStudentId] = useState<string>(() => {
    try {
      return localStorage.getItem('culinary_student_id') || '113402018';
    } catch {
      return '113402018';
    }
  });

  const [studentName, setStudentName] = useState<string>(() => {
    try {
      return localStorage.getItem('culinary_student_name') || '王小明';
    } catch {
      return '王小明';
    }
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');

  // Mastered Flashcards State
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('culinary_mastered_cards');
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // default
    }
    // Default 5 mastered for initial presentation
    return new Set(['knife-1', 'knife-2', 'heat-1', 'heat-3', 'cook-1']);
  });

  // Quiz Result Record
  const [quizResult, setQuizResult] = useState<QuizResultRecord | null>(() => {
    try {
      const stored = localStorage.getItem('culinary_last_quiz');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Sync profile changes to localStorage
  const handleSaveProfile = (newId: string, newName: string) => {
    setStudentId(newId);
    setStudentName(newName);
    try {
      localStorage.setItem('culinary_student_id', newId);
      localStorage.setItem('culinary_student_name', newName);
    } catch {
      // ignore
    }
  };

  // Toggle flashcard mastered
  const handleToggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      try {
        localStorage.setItem('culinary_mastered_cards', JSON.stringify(Array.from(updated)));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Save quiz result
  const handleSaveQuizResult = (result: QuizResultRecord) => {
    setQuizResult(result);
    try {
      localStorage.setItem('culinary_last_quiz', JSON.stringify(result));
    } catch {
      // ignore
    }
  };

  // Sound toggle
  const handleToggleSound = () => {
    const updated = soundManager.toggleMute();
    setIsMuted(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navbar */}
      <TopNavbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        studentId={studentId}
        studentName={studentName}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenPdf={() => setIsPdfModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'overview' && (
          <OverviewView
            studentName={studentName}
            studentId={studentId}
            masteredCount={masteredIds.size}
            totalFlashcards={FLASHCARDS.length}
            quizScore={quizResult ? quizResult.score : null}
            onSelectTab={setCurrentTab}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenPdf={() => setIsPdfModalOpen(true)}
          />
        )}

        {currentTab === 'flashcards' && (
          <FlashcardsView
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMastered}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizView
            studentName={studentName}
            studentId={studentId}
            onSaveQuizResult={handleSaveQuizResult}
            onOpenPdf={() => setIsPdfModalOpen(true)}
          />
        )}

        {currentTab === 'scenarios' && (
          <ScenarioView
            studentName={studentName}
            studentId={studentId}
            onOpenPdf={() => setIsPdfModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">中餐烹調作業數位學習系統</span>
            <span>·</span>
            <span>第 2 章 食物烹調作業教材認證</span>
          </div>
          <div className="flex items-center gap-4">
            <span>學員：{studentName} ({studentId})</span>
            <span>·</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-amber-700 hover:text-amber-800 underline"
            >
              更換學籍
            </button>
            <span>·</span>
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="text-amber-700 hover:text-amber-800 underline"
            >
              列印成績證明
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        studentId={studentId}
        studentName={studentName}
        onSave={handleSaveProfile}
      />

      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        studentId={studentId}
        studentName={studentName}
        masteredFlashcardsCount={masteredIds.size}
        totalFlashcardsCount={FLASHCARDS.length}
        quizResult={quizResult}
      />
    </div>
  );
}
