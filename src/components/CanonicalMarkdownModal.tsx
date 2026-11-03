import React, { useState } from 'react';
import { Copy, Check, FileDown, BookOpen } from 'lucide-react';
import { StudyKit } from '../types';

interface CanonicalMarkdownModalProps {
  kit: StudyKit;
  onClose: () => void;
}

export const CanonicalMarkdownModal: React.FC<CanonicalMarkdownModalProps> = ({ kit, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Generate the formatted markdown matching the exact prompt layout
  const markdownText = `# ${kit.title}
*Difficulty: ${kit.difficulty.toUpperCase()} • Generated: ${new Date(kit.createdAt).toLocaleDateString()}*

### 1. Key Concepts & Summaries

${kit.keyConcepts
  .map(
    (concept, i) => `* **${concept.concept}**: ${concept.explanation}`
  )
  .join('\n\n')}

### 2. Practice Exam Questions

* **Multiple Choice Question (MCQ)**:
  ${kit.practiceQuestions.mcq.question}
  - A: ${kit.practiceQuestions.mcq.options[0]}
  - B: ${kit.practiceQuestions.mcq.options[1]}
  - C: ${kit.practiceQuestions.mcq.options[2]}
  - D: ${kit.practiceQuestions.mcq.options[3]}
  *Correct Answer*: Option ${['A', 'B', 'C', 'D'][kit.practiceQuestions.mcq.correctAnswerIndex]}
  *Explanation*: ${kit.practiceQuestions.mcq.explanation}

* **Short Answer Question**:
  ${kit.practiceQuestions.shortAnswer.question}
  *Sample High-Scoring Answer*:
  ${kit.practiceQuestions.shortAnswer.sampleHighScoringAnswer}
  *Scoring Criteria*:
  ${kit.practiceQuestions.shortAnswer.scoringCriteria.map((c) => `  - ${c}`).join('\n')}

* **Conceptual Application Question**:
  *Scenario*: ${kit.practiceQuestions.conceptualApplication.scenario}
  *Question*: ${kit.practiceQuestions.conceptualApplication.question}
  *Sample Solution*:
  ${kit.practiceQuestions.conceptualApplication.sampleSolution}

### 3. Flashcard Set (JSON Format)

\`\`\`json
${JSON.stringify(
  kit.flashcards.map((f) => ({ front: f.front, back: f.back })),
  null,
  2
)}
\`\`\`

### 4. Constraints

* Created strictly from the provided source material only.
* No external internet or outside facts referenced.
* Total flashcards in deck: ${kit.flashcards.length} (between 5 and 10).
* Difficulty level selected: ${kit.difficulty.toUpperCase()}.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kit.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-study-kit.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D12]/80 backdrop-blur-sm p-4">
      <div className="bg-[#171B25] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#292E3B] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#292E3B] flex items-center justify-between bg-[#10131B]">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-4 h-4 text-[#A78BFA]" />
            <div>
              <h3 className="font-semibold text-[#F5F3EF] text-sm sm:text-base">
                Structured Study Kit Document
              </h3>
              <p className="text-xs text-[#969CAB]">
                Exact layout according to the Academic Tutor specification
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#A78BFA] text-[#0B0D12] hover:bg-[#b89eff] transition flex items-center space-x-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1D2230] text-[#F5F3EF] hover:bg-[#252b3d] border border-[#292E3B] transition flex items-center space-x-1 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-[#75C9B2]" />
              <span>Download .md</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#1D2230] transition text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 overflow-auto bg-[#10131B] text-[#F5F3EF] font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
          {markdownText}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#171B25] border-t border-[#292E3B] text-xs text-[#969CAB] flex items-center justify-between">
          <span>Formatted with Sections 1, 2, 3, and 4 constraints</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#A78BFA] font-medium hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
