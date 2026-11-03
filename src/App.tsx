import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  HelpCircle,
  FileText,
  RotateCcw,
  Calendar,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { StudyKit, DifficultyLevel } from './types';
import { Header } from './components/Header';
import { MaterialInput } from './components/MaterialInput';
import { KeyConceptsView } from './components/KeyConceptsView';
import { PracticeExamView } from './components/PracticeExamView';
import { FlashcardsView } from './components/FlashcardsView';
import { CanonicalMarkdownModal } from './components/CanonicalMarkdownModal';
import { StudyHistoryDrawer } from './components/StudyHistoryDrawer';
import { getSavedKits, saveKitToHistory, removeKitFromHistory } from './utils/storageUtils';

export default function App() {
  const [activeKit, setActiveKit] = useState<StudyKit | null>(null);
  const [activeTab, setActiveTab] = useState<'concepts' | 'questions' | 'flashcards' | 'all'>('concepts');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<StudyKit[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = getSavedKits();
    setHistory(saved);
    if (saved.length > 0) {
      setActiveKit(saved[0]);
    }
  }, []);

  const handleGenerate = async (payload: {
    materialText: string;
    images: { mimeType: string; data: string }[];
    difficulty: DifficultyLevel;
  }) => {
    setIsLoading(true);
    setGlobalError(null);

    try {
      const response = await fetch('/api/generate-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error('Invalid response structure received from server');
      }

      const newKit: StudyKit = result.data;
      setActiveKit(newKit);
      saveKitToHistory(newKit);
      setHistory(getSavedKits());
      setActiveTab('concepts');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Generation failed:', err);
      setGlobalError(err.message || 'Failed to generate study kit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectKit = (kit: StudyKit) => {
    setActiveKit(kit);
    setActiveTab('concepts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteKit = (id: string) => {
    const updated = removeKitFromHistory(id);
    setHistory(updated);
    if (activeKit?.id === id) {
      setActiveKit(updated[0] || null);
    }
  };

  const handleNewKit = () => {
    setActiveKit(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F5F3EF] font-sans flex flex-col selection:bg-[#A78BFA] selection:text-[#0B0D12]">
      {/* Global Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenMarkdown={() => setIsMarkdownModalOpen(true)}
        onNewKit={handleNewKit}
        hasActiveKit={!!activeKit}
        historyCount={history.length}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {globalError && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-[#171B25] border border-rose-500/50 text-[#F5F3EF] flex items-start space-x-3 text-xs sm:text-sm shadow-lg">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-rose-300">Generation Notice: </span>
              <span className="text-[#969CAB]">{globalError}</span>
            </div>
            <button
              type="button"
              onClick={() => setGlobalError(null)}
              className="text-xs text-[#969CAB] hover:text-[#F5F3EF] font-medium transition cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: Input / Generator Screen (when no kit is loaded or user clicked New Kit) */}
        {!activeKit && (
          <MaterialInput onGenerate={handleGenerate} isLoading={isLoading} />
        )}

        {/* VIEW 2: Active Study Kit Dashboard */}
        {activeKit && (
          <div className="space-y-6">
            {/* Top Study Kit Hero Banner Card */}
            <div className="bg-[#171B25] rounded-2xl p-6 sm:p-7 border border-[#292E3B] shadow-sm print:border-none print:shadow-none">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        activeKit.difficulty === 'hard'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : activeKit.difficulty === 'medium'
                          ? 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/30'
                          : 'bg-[#75C9B2]/10 text-[#75C9B2] border-[#75C9B2]/30'
                      }`}
                    >
                      {activeKit.difficulty.toUpperCase()} DIFFICULTY
                    </span>
                    <span className="text-xs text-[#969CAB] flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#969CAB]" />
                      <span>{new Date(activeKit.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="text-xs text-[#75C9B2] font-medium flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Grounded strictly in source material</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-semibold text-[#F5F3EF] tracking-tight">
                    {activeKit.title}
                  </h1>
                </div>

                <div className="flex items-center space-x-2 print:hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsMarkdownModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-medium text-[#969CAB] hover:text-[#F5F3EF] bg-[#10131B] hover:bg-[#1D2230] rounded-lg border border-[#292E3B] transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#A78BFA]" />
                    <span>Structured Markdown</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNewKit}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#0B0D12] bg-[#A78BFA] hover:bg-[#b89eff] rounded-lg shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Upload Another</span>
                  </button>
                </div>
              </div>

              {/* Study Mode Navigation Tabs (Linear Segmented Style) */}
              <div className="mt-6 flex flex-wrap border-b border-[#292E3B] gap-1 sm:gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab('concepts')}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition cursor-pointer ${
                    activeTab === 'concepts'
                      ? 'border-[#A78BFA] text-[#F5F3EF] bg-[#1D2230]/40 rounded-t-lg'
                      : 'border-transparent text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230]/20'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>1. Key Concepts</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#10131B] text-[#969CAB] border border-[#292E3B]">
                    {activeKit.keyConcepts.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('questions')}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition cursor-pointer ${
                    activeTab === 'questions'
                      ? 'border-[#A78BFA] text-[#F5F3EF] bg-[#1D2230]/40 rounded-t-lg'
                      : 'border-transparent text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230]/20'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#75C9B2]" />
                  <span>2. Practice Exam</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#10131B] text-[#969CAB] border border-[#292E3B]">
                    3
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition cursor-pointer ${
                    activeTab === 'flashcards'
                      ? 'border-[#A78BFA] text-[#F5F3EF] bg-[#1D2230]/40 rounded-t-lg'
                      : 'border-transparent text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230]/20'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>3. Flashcard Set</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#10131B] text-[#969CAB] border border-[#292E3B]">
                    {activeKit.flashcards.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition cursor-pointer ${
                    activeTab === 'all'
                      ? 'border-[#A78BFA] text-[#F5F3EF] bg-[#1D2230]/40 rounded-t-lg'
                      : 'border-transparent text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230]/20'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#75C9B2]" />
                  <span>Comprehensive Study Sheet</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="mt-6">
              {activeTab === 'concepts' && (
                <KeyConceptsView concepts={activeKit.keyConcepts} title={activeKit.title} />
              )}

              {activeTab === 'questions' && (
                <PracticeExamView questions={activeKit.practiceQuestions} />
              )}

              {activeTab === 'flashcards' && (
                <FlashcardsView flashcards={activeKit.flashcards} />
              )}

              {activeTab === 'all' && (
                <div className="space-y-10">
                  <KeyConceptsView concepts={activeKit.keyConcepts} title={activeKit.title} />
                  <PracticeExamView questions={activeKit.practiceQuestions} />
                  <FlashcardsView flashcards={activeKit.flashcards} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Minimal Editorial Footer */}
      <footer className="mt-auto border-t border-[#292E3B] bg-[#0B0D12] py-6 text-center text-xs text-[#969CAB] print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-[#F5F3EF]">StudyCraft</span>
            <span>•</span>
            <span>Academic Tutor &amp; Exam Preparation Assistant</span>
          </div>
          <div className="flex items-center space-x-3 text-[#969CAB]">
            <span>Free-tier token capped (&lt;30K)</span>
            <span>•</span>
            <span className="text-[#75C9B2]">Strict Zero-Hallucination Grounding</span>
          </div>
        </div>
      </footer>

      {/* Canonical Layout Markdown Modal */}
      {isMarkdownModalOpen && activeKit && (
        <CanonicalMarkdownModal
          kit={activeKit}
          onClose={() => setIsMarkdownModalOpen(false)}
        />
      )}

      {/* Saved Study Kits Drawer */}
      <StudyHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        kits={history}
        activeKitId={activeKit?.id || null}
        onSelectKit={handleSelectKit}
        onDeleteKit={handleDeleteKit}
      />
    </div>
  );
}
