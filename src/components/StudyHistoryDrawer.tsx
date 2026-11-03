import React from 'react';
import { FolderArchive, Trash2, ArrowRight, BookOpen, Calendar } from 'lucide-react';
import { StudyKit } from '../types';

interface StudyHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  kits: StudyKit[];
  activeKitId: string | null;
  onSelectKit: (kit: StudyKit) => void;
  onDeleteKit: (id: string) => void;
}

export const StudyHistoryDrawer: React.FC<StudyHistoryDrawerProps> = ({
  isOpen,
  onClose,
  kits,
  activeKitId,
  onSelectKit,
  onDeleteKit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0B0D12]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#10131B] h-full flex flex-col shadow-2xl border-l border-[#292E3B]">
        {/* Header */}
        <div className="p-5 border-b border-[#292E3B] flex items-center justify-between bg-[#171B25]">
          <div className="flex items-center space-x-2.5">
            <FolderArchive className="w-4 h-4 text-[#A78BFA]" />
            <div>
              <h3 className="font-semibold text-[#F5F3EF] text-sm sm:text-base">Saved Study Kits</h3>
              <p className="text-xs text-[#969CAB]">{kits.length} available in local library</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230] transition text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Kits list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {kits.map((kit) => {
            const isActive = kit.id === activeKitId;
            return (
              <div
                key={kit.id}
                className={`p-4 rounded-xl border transition ${
                  isActive
                    ? 'border-[#A78BFA]/60 bg-[#1D2230] shadow-sm'
                    : 'border-[#292E3B] hover:border-[#3B4254] bg-[#171B25] hover:bg-[#191e2a]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      kit.difficulty === 'hard'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : kit.difficulty === 'medium'
                        ? 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/30'
                        : 'bg-[#75C9B2]/10 text-[#75C9B2] border-[#75C9B2]/30'
                    }`}
                  >
                    {kit.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-[#969CAB] text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(kit.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-[#F5F3EF] text-sm leading-snug line-clamp-2 mb-2">
                  {kit.title}
                </h4>

                <div className="text-xs text-[#969CAB] flex items-center space-x-2.5 mb-3 font-normal">
                  <span>{kit.keyConcepts?.length || 0} Concepts</span>
                  <span>•</span>
                  <span>3 Questions</span>
                  <span>•</span>
                  <span>{kit.flashcards?.length || 0} Flashcards</span>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#292E3B]">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectKit(kit);
                      onClose();
                    }}
                    className="text-xs font-semibold text-[#A78BFA] hover:text-[#b89eff] flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Load Study Kit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteKit(kit.id)}
                    className="p-1.5 rounded-lg text-[#969CAB] hover:text-rose-400 hover:bg-[#1D2230] transition cursor-pointer"
                    title="Delete kit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {kits.length === 0 && (
            <div className="text-center py-12 text-[#969CAB]">
              <BookOpen className="w-8 h-8 mx-auto mb-2.5 text-[#292E3B]" />
              <p className="text-sm font-medium text-[#F5F3EF]">No saved study kits yet</p>
              <p className="text-xs text-[#969CAB] mt-1">
                Upload notes or choose a sample topic to generate your first kit!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
