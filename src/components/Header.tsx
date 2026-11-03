import React from 'react';
import { BookOpen, FolderArchive, FileText, Printer, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenMarkdown: () => void;
  onNewKit: () => void;
  hasActiveKit: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenMarkdown,
  onNewKit,
  hasActiveKit,
  historyCount,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#292E3B] text-[#F5F3EF] print:hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group select-none" 
          onClick={onNewKit}
        >
          <div className="w-9 h-9 rounded-lg bg-[#171B25] border border-[#292E3B] flex items-center justify-center text-[#A78BFA] group-hover:border-[#A78BFA]/50 group-hover:bg-[#1D2230] transition duration-200">
            <BookOpen className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-[#F5F3EF] group-hover:text-white transition">
                StudyCraft
              </span>
              <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-[#171B25] text-[#A78BFA] border border-[#292E3B]">
                Academic Tutor
              </span>
            </div>
            <p className="text-[11px] text-[#969CAB] hidden sm:block font-normal">
              Grounded Study Kit &amp; Exam Prep Engine
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {hasActiveKit && (
            <>
              <button
                type="button"
                onClick={onOpenMarkdown}
                className="px-3 py-1.5 text-xs font-medium text-[#969CAB] hover:text-[#F5F3EF] bg-[#171B25] hover:bg-[#1D2230] rounded-lg border border-[#292E3B] transition duration-150 flex items-center space-x-1.5 cursor-pointer"
                title="View canonical layout"
              >
                <FileText className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span className="hidden md:inline">Structured View</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-medium text-[#969CAB] hover:text-[#F5F3EF] bg-[#171B25] hover:bg-[#1D2230] rounded-lg border border-[#292E3B] transition duration-150 flex items-center space-x-1.5 cursor-pointer"
                title="Print or Save Study Sheet PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#75C9B2]" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={onNewKit}
                className="px-3 py-1.5 text-xs font-medium text-[#A78BFA] hover:text-white bg-[#1D2230] hover:bg-[#A78BFA]/20 border border-[#A78BFA]/30 rounded-lg transition duration-150 flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Material</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onOpenHistory}
            className="relative px-3 py-1.5 text-xs font-medium text-[#969CAB] hover:text-[#F5F3EF] bg-[#171B25] hover:bg-[#1D2230] rounded-lg border border-[#292E3B] transition duration-150 flex items-center space-x-1.5 cursor-pointer"
          >
            <FolderArchive className="w-3.5 h-3.5 text-[#969CAB]" />
            <span className="hidden sm:inline">Saved Kits</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#292E3B] text-[#A78BFA] border border-[#A78BFA]/20">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
