import React, { useState, useEffect } from 'react';
import {
  Rotate3d,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Code,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Flashcard } from '../types';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ flashcards }) => {
  const [deck, setDeck] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [learningIds, setLearningIds] = useState<Set<number>>(new Set());
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Sync if new flashcards arrive
  useEffect(() => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setLearningIds(new Set());
  }, [flashcards]);

  // Keyboard navigation: Space to flip, Arrows to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.length]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setDeck(flashcards);
    setCurrentIndex(0);
    setMasteredIds(new Set());
    setLearningIds(new Set());
  };

  const markMastered = () => {
    const newMastered = new Set(masteredIds);
    newMastered.add(currentIndex);
    setMasteredIds(newMastered);

    const newLearning = new Set(learningIds);
    newLearning.delete(currentIndex);
    setLearningIds(newLearning);

    if (newMastered.size === deck.length) {
      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    } else {
      handleNext();
    }
  };

  const markLearning = () => {
    const newLearning = new Set(learningIds);
    newLearning.add(currentIndex);
    setLearningIds(newLearning);

    const newMastered = new Set(masteredIds);
    newMastered.delete(currentIndex);
    setMasteredIds(newMastered);

    handleNext();
  };

  const currentCard = deck[currentIndex] || { front: '', back: '' };
  const masteryPercentage = Math.round((masteredIds.size / (deck.length || 1)) * 100);

  const cleanJsonString = JSON.stringify(
    deck.map((c) => ({ front: c.front, back: c.back })),
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(cleanJsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Section Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-[#171B25] p-5 rounded-2xl border border-[#292E3B] shadow-sm">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-5 h-5 rounded-md bg-[#1D2230] border border-[#292E3B] text-[#A78BFA] flex items-center justify-center text-[11px] font-semibold">
              3
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#F5F3EF] tracking-tight">
              Flashcard Set
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#969CAB] mt-1 font-normal">
            {deck.length} high-retention cards (formatted strictly as JSON). Click or press Space to flip.
          </p>
        </div>

        {/* JSON & Deck Actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleShuffle}
            className="px-2.5 py-1.5 text-xs font-medium text-[#969CAB] hover:text-[#F5F3EF] bg-[#10131B] hover:bg-[#1D2230] border border-[#292E3B] rounded-lg transition flex items-center space-x-1 cursor-pointer"
            title="Shuffle deck"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1.5 text-xs font-medium text-[#969CAB] hover:text-[#F5F3EF] bg-[#10131B] hover:bg-[#1D2230] border border-[#292E3B] rounded-lg transition flex items-center space-x-1 cursor-pointer"
            title="Reset progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            className="px-2.5 py-1.5 text-xs font-medium text-[#A78BFA] bg-[#1D2230] hover:bg-[#A78BFA]/20 border border-[#A78BFA]/30 rounded-lg transition flex items-center space-x-1.5 cursor-pointer"
            title="View Raw JSON format"
          >
            <Code className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>JSON Set</span>
          </button>
        </div>
      </div>

      {/* Progress & Mastery Bar */}
      <div className="bg-[#171B25] p-4 rounded-xl border border-[#292E3B] shadow-sm">
        <div className="flex items-center justify-between text-xs font-medium mb-2.5">
          <span className="text-[#969CAB] font-mono">
            Card {currentIndex + 1} of {deck.length}
          </span>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-[#75C9B2] font-semibold">
              {masteredIds.size} Mastered ({masteryPercentage}%)
            </span>
            <span className="text-[#969CAB] font-normal">
              {learningIds.size} In Progress
            </span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-[#10131B] rounded-full overflow-hidden flex">
          <div
            className="bg-[#75C9B2] h-full transition-all duration-300"
            style={{ width: `${masteryPercentage}%` }}
          />
          <div
            className="bg-[#A78BFA]/50 h-full transition-all duration-300"
            style={{ width: `${(learningIds.size / (deck.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Interactive Card Container */}
      <div className="flex flex-col items-center">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-xl h-72 sm:h-80 cursor-pointer select-none perspective-[1000px]"
        >
          <div
            className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* FRONT OF CARD (Term or Question) */}
            <div
              className="absolute inset-0 w-full h-full rounded-2xl bg-[#171B25] p-7 sm:p-8 flex flex-col justify-between border border-[#292E3B] hover:border-[#A78BFA]/50 shadow-xl transition backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#10131B] text-[#A78BFA] border border-[#292E3B]">
                  Front • Term / Question
                </span>
                <span className="text-xs font-normal text-[#969CAB] flex items-center space-x-1.5">
                  <Rotate3d className="w-3.5 h-3.5 text-[#969CAB]" />
                  <span>Click or Space to flip</span>
                </span>
              </div>

              <div className="my-auto text-center px-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#F5F3EF] leading-snug tracking-tight">
                  {currentCard.front}
                </h3>
              </div>

              <div className="text-center text-xs font-mono text-[#969CAB]">
                {currentIndex + 1} / {deck.length}
              </div>
            </div>

            {/* BACK OF CARD (Definition or Answer) */}
            <div
              className="absolute inset-0 w-full h-full rounded-2xl bg-[#1D2230] text-[#F5F3EF] p-7 sm:p-8 flex flex-col justify-between border border-[#75C9B2]/40 shadow-xl transition rotate-y-180 backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#10131B] text-[#75C9B2] border border-[#75C9B2]/30">
                  Back • Definition / Answer
                </span>
                <span className="text-xs font-normal text-[#969CAB] flex items-center space-x-1.5">
                  <Rotate3d className="w-3.5 h-3.5 text-[#75C9B2]" />
                  <span>Flip to front</span>
                </span>
              </div>

              <div className="my-auto text-center px-3 overflow-y-auto max-h-44">
                <p className="text-sm sm:text-base font-normal text-[#F5F3EF] leading-relaxed">
                  {currentCard.back}
                </p>
              </div>

              <div className="text-center text-[11px] text-[#969CAB]">
                Grounded strictly in source material
              </div>
            </div>
          </div>
        </div>

        {/* Card Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-xl bg-[#171B25] border border-[#292E3B] text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230] shadow-sm flex items-center justify-center transition cursor-pointer active:scale-95"
            title="Previous Card (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={markLearning}
            className="px-3.5 py-2.5 rounded-xl bg-[#171B25] hover:bg-[#1D2230] text-[#969CAB] hover:text-[#F5F3EF] border border-[#292E3B] font-medium text-xs transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Still Learning</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2.5 rounded-xl bg-[#1D2230] hover:bg-[#252b3d] text-[#F5F3EF] border border-[#292E3B] font-medium text-xs shadow-sm transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Rotate3d className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>{isFlipped ? 'Show Front' : 'Show Answer'}</span>
          </button>

          <button
            type="button"
            onClick={markMastered}
            className="px-3.5 py-2.5 rounded-xl bg-[#171B25] hover:bg-[#1D2230] text-[#75C9B2] border border-[#75C9B2]/30 font-medium text-xs transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#75C9B2]" />
            <span>I Know This</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-xl bg-[#171B25] border border-[#292E3B] text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230] shadow-sm flex items-center justify-center transition cursor-pointer active:scale-95"
            title="Next Card (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-[#969CAB] mt-3.5 text-center font-normal">
          Shortcut: Press <kbd className="px-1.5 py-0.5 rounded bg-[#171B25] border border-[#292E3B] text-[#F5F3EF] font-mono text-[10px]">Space</kbd> to flip, and <kbd className="px-1.5 py-0.5 rounded bg-[#171B25] border border-[#292E3B] text-[#F5F3EF] font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-[#171B25] border border-[#292E3B] text-[#F5F3EF] font-mono text-[10px]">→</kbd> to navigate cards.
        </p>
      </div>

      {/* JSON MODAL: Layout strictly as requested in prompt */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D12]/80 backdrop-blur-sm p-4">
          <div className="bg-[#171B25] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#292E3B] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#292E3B] flex items-center justify-between bg-[#10131B]">
              <div className="flex items-center space-x-2.5">
                <Code className="w-4 h-4 text-[#A78BFA]" />
                <div>
                  <h3 className="font-semibold text-[#F5F3EF] text-sm sm:text-base">
                    Flashcard Set (JSON Format)
                  </h3>
                  <p className="text-xs text-[#969CAB]">
                    Clean JSON array matching the prompt specification
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#A78BFA] text-[#0B0D12] hover:bg-[#b89eff] transition flex items-center space-x-1 cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowJsonModal(false)}
                  className="p-1.5 rounded-lg text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230] transition text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto bg-[#10131B] font-mono text-xs text-[#75C9B2] leading-relaxed">
              <pre>{cleanJsonString}</pre>
            </div>

            <div className="p-3 bg-[#171B25] border-t border-[#292E3B] text-xs text-[#969CAB] flex items-center justify-between">
              <span>{deck.length} flashcards in valid JSON array</span>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="text-[#A78BFA] font-medium hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
