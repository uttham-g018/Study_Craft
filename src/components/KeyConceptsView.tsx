import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, Search, BookMarked } from 'lucide-react';
import { KeyConcept } from '../types';

interface KeyConceptsViewProps {
  concepts: KeyConcept[];
  title: string;
}

export const KeyConceptsView: React.FC<KeyConceptsViewProps> = ({ concepts, title }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (concept: KeyConcept, index: number) => {
    navigator.clipboard.writeText(`${concept.concept}: ${concept.explanation}`);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const filteredConcepts = concepts.filter(
    (c) =>
      c.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Section Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-[#171B25] p-5 rounded-2xl border border-[#292E3B] shadow-sm">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-5 h-5 rounded-md bg-[#1D2230] border border-[#292E3B] text-[#A78BFA] flex items-center justify-center text-[11px] font-semibold">
              1
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#F5F3EF] tracking-tight">
              Key Concepts &amp; Summaries
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#969CAB] mt-1 font-normal">
            Core fundamentals extracted strictly from your material, phrased in 2–3 concise sentences of plain language.
          </p>
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#969CAB] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#292E3B] focus:outline-none focus:border-[#A78BFA] bg-[#10131B] text-[#F5F3EF] placeholder-[#969CAB]/50 transition"
          />
        </div>
      </div>

      {/* Concepts Grid / List */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredConcepts.map((item, index) => {
          const isSpeaking = speakingIndex === index;
          const isCopied = copiedIndex === index;

          return (
            <div
              key={index}
              className="bg-[#171B25] rounded-xl p-5 border border-[#292E3B] hover:border-[#A78BFA]/40 hover:bg-[#191e2a] transition duration-150 group shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-[#10131B] border border-[#292E3B] text-[#A78BFA] flex items-center justify-center font-mono font-medium text-xs shrink-0 mt-0.5 group-hover:border-[#A78BFA]/30 transition">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[#F5F3EF] tracking-tight group-hover:text-white transition">
                      {item.concept}
                    </h3>
                    <p className="mt-2 text-[#969CAB] text-sm leading-relaxed font-normal">
                      {item.explanation}
                    </p>
                  </div>
                </div>

                {/* Micro Actions */}
                <div className="flex items-center space-x-1 shrink-0 pt-0.5">
                  {'speechSynthesis' in window && (
                    <button
                      type="button"
                      onClick={() => handleSpeak(`${item.concept}. ${item.explanation}`, index)}
                      className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                        isSpeaking
                          ? 'bg-[#A78BFA] text-[#0B0D12]'
                          : 'text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230]'
                      }`}
                      title={isSpeaking ? 'Stop listening' : 'Read aloud with Text-to-Speech'}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCopy(item, index)}
                    className="p-1.5 rounded-lg text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230] transition cursor-pointer"
                    title="Copy concept"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-[#75C9B2]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredConcepts.length === 0 && (
          <div className="text-center py-10 bg-[#171B25] rounded-xl border border-[#292E3B] text-[#969CAB] text-xs sm:text-sm">
            No concepts match "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
