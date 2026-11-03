import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  AlertCircle,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PracticeQuestions, AnswerEvaluation } from '../types';

interface PracticeExamViewProps {
  questions: PracticeQuestions;
}

export const PracticeExamView: React.FC<PracticeExamViewProps> = ({ questions }) => {
  // MCQ state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showMcqExplanation, setShowMcqExplanation] = useState(false);

  // Short Answer state
  const [studentShortAnswer, setStudentShortAnswer] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  // Conceptual Application state
  const [studentApplicationAnswer, setStudentApplicationAnswer] = useState('');
  const [showApplicationSolution, setShowApplicationSolution] = useState(false);

  const { mcq, shortAnswer, conceptualApplication } = questions;

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowMcqExplanation(true);

    if (index === mcq.correctAnswerIndex) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const handleResetMcq = () => {
    setSelectedOption(null);
    setShowMcqExplanation(false);
  };

  const handleEvaluateShortAnswer = async () => {
    if (!studentShortAnswer.trim()) return;
    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: shortAnswer.question,
          sampleAnswer: shortAnswer.sampleHighScoringAnswer,
          studentAnswer: studentShortAnswer,
        }),
      });

      if (!res.ok) {
        throw new Error('Evaluation request failed');
      }

      const data = await res.json();
      setEvaluation(data.evaluation);

      if (data.evaluation?.score >= 8) {
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 },
          });
        } catch (e) {}
      }
    } catch (err: any) {
      setEvaluationError(err.message || 'Could not evaluate response. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Section Header Card */}
      <div className="bg-[#171B25] p-5 rounded-2xl border border-[#292E3B] shadow-sm">
        <div className="flex items-center space-x-2.5">
          <span className="w-5 h-5 rounded-md bg-[#1D2230] border border-[#292E3B] text-[#75C9B2] flex items-center justify-center text-[11px] font-semibold">
            2
          </span>
          <h2 className="text-lg sm:text-xl font-semibold text-[#F5F3EF] tracking-tight">
            Practice Exam Questions
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#969CAB] mt-1 font-normal">
          3 distinct exam questions generated strictly from your source material: MCQ, Short Answer, and Conceptual Application.
        </p>
      </div>

      {/* QUESTION 1: MULTIPLE CHOICE QUESTION (MCQ) */}
      <div className="bg-[#171B25] rounded-2xl p-5 sm:p-6 border border-[#292E3B] shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#10131B] text-[#A78BFA] border border-[#292E3B]">
            <span>Part 2.1 • Multiple Choice Question</span>
          </span>
          {selectedOption !== null && (
            <button
              type="button"
              onClick={handleResetMcq}
              className="text-xs font-medium text-[#969CAB] hover:text-[#F5F3EF] flex items-center space-x-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Choice</span>
            </button>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-[#F5F3EF] mb-4 leading-snug">
          {mcq.question}
        </h3>

        {/* 4 Options */}
        <div className="space-y-2.5">
          {mcq.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === mcq.correctAnswerIndex;
            const hasAnswered = selectedOption !== null;

            let buttonStyle = 'border-[#292E3B] hover:border-[#3B4254] hover:bg-[#1D2230] bg-[#10131B] text-[#F5F3EF]';
            let badgeStyle = 'bg-[#171B25] border-[#292E3B] text-[#969CAB]';

            if (hasAnswered) {
              if (isCorrect) {
                buttonStyle = 'border-[#75C9B2] bg-[#1D2230] text-[#F5F3EF] shadow-sm';
                badgeStyle = 'bg-[#75C9B2] border-[#75C9B2] text-[#0B0D12]';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'border-rose-500/70 bg-[#1D2230] text-[#F5F3EF]';
                badgeStyle = 'bg-rose-500 border-rose-500 text-white';
              } else {
                buttonStyle = 'border-[#292E3B] bg-[#10131B]/40 opacity-40 text-[#969CAB]';
                badgeStyle = 'bg-[#10131B] border-[#292E3B] text-[#969CAB]';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-start space-x-3 text-sm cursor-pointer ${buttonStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-md font-mono font-medium text-xs flex items-center justify-center shrink-0 mt-0.5 border ${badgeStyle}`}
                >
                  {optionLetters[idx]}
                </span>
                <span className="flex-1 font-normal leading-relaxed">{option}</span>
                {hasAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-[#75C9B2] shrink-0 mt-0.5" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* MCQ Explanation Card */}
        {showMcqExplanation && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs sm:text-sm border ${
              selectedOption === mcq.correctAnswerIndex
                ? 'bg-[#10131B] border-[#75C9B2]/40 text-[#F5F3EF]'
                : 'bg-[#10131B] border-[#292E3B] text-[#F5F3EF]'
            }`}
          >
            <div className="flex items-center space-x-2 font-semibold mb-1.5">
              {selectedOption === mcq.correctAnswerIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#75C9B2]" />
                  <span className="text-[#75C9B2]">Correct Answer (Option {optionLetters[mcq.correctAnswerIndex]})</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-[#A78BFA]" />
                  <span className="text-[#A78BFA]">Correct Answer is Option {optionLetters[mcq.correctAnswerIndex]}</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#969CAB] leading-relaxed">{mcq.explanation}</p>
          </div>
        )}
      </div>

      {/* QUESTION 2: SHORT ANSWER QUESTION */}
      <div className="bg-[#171B25] rounded-2xl p-5 sm:p-6 border border-[#292E3B] shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#10131B] text-[#75C9B2] border border-[#292E3B]">
            <span>Part 2.2 • Short Answer Question</span>
          </span>
          <button
            type="button"
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="text-xs font-medium text-[#75C9B2] hover:text-[#91ded0] flex items-center space-x-1 transition cursor-pointer"
          >
            {showModelAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showModelAnswer ? 'Hide Sample Answer' : 'Reveal Sample Answer'}</span>
          </button>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-[#F5F3EF] mb-3.5 leading-snug">
          {shortAnswer.question}
        </h3>

        {/* Interactive Student Workspace */}
        <div>
          <textarea
            rows={4}
            value={studentShortAnswer}
            onChange={(e) => setStudentShortAnswer(e.target.value)}
            placeholder="Draft your answer here to test yourself before reviewing the sample model response..."
            className="w-full p-3.5 rounded-xl border border-[#292E3B] focus:border-[#75C9B2] focus:ring-1 focus:ring-[#75C9B2] text-sm text-[#F5F3EF] placeholder-[#969CAB]/40 bg-[#10131B] transition outline-none leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
            <span className="text-xs text-[#969CAB]">
              {studentShortAnswer.trim()
                ? `${studentShortAnswer.trim().split(/\s+/).length} words`
                : 'Practice answering in 2–4 concise sentences'}
            </span>

            <button
              type="button"
              disabled={isEvaluating || !studentShortAnswer.trim()}
              onClick={handleEvaluateShortAnswer}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                isEvaluating || !studentShortAnswer.trim()
                  ? 'bg-[#1D2230] text-[#969CAB] border border-[#292E3B] cursor-not-allowed'
                  : 'bg-[#75C9B2] hover:bg-[#8ee1cb] text-[#0B0D12] shadow-sm active:scale-95'
              }`}
            >
              {isEvaluating ? (
                <>
                  <div className="w-3 h-3 border-2 border-[#0B0D12]/30 border-t-[#0B0D12] rounded-full animate-spin" />
                  <span>Evaluating with Rubric...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Grade My Response</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Evaluation Result Card */}
        {evaluation && (
          <div className="mt-4 p-4 rounded-xl bg-[#10131B] border border-[#292E3B]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#75C9B2]" />
                <span className="font-semibold text-[#F5F3EF] text-sm">
                  Tutor Assessment: {evaluation.verdict} ({evaluation.score}/10)
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#969CAB] mb-3 leading-relaxed">
              {evaluation.feedback}
            </p>
            {evaluation.strengths?.length > 0 && (
              <div className="mb-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#75C9B2] block mb-1">
                  Strengths:
                </span>
                <ul className="text-xs text-[#969CAB] space-y-1 pl-4 list-disc">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.improvements?.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A78BFA] block mb-1">
                  To achieve full marks:
                </span>
                <ul className="text-xs text-[#969CAB] space-y-1 pl-4 list-disc">
                  {evaluation.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Model Answer Card */}
        {showModelAnswer && (
          <div className="mt-4 p-4 rounded-xl bg-[#10131B] text-[#F5F3EF] border border-[#292E3B]">
            <div className="flex items-center space-x-2 font-semibold text-xs uppercase tracking-wider text-[#75C9B2] mb-2">
              <Check className="w-3.5 h-3.5" />
              <span>Sample High-Scoring Answer</span>
            </div>
            <p className="text-xs sm:text-sm text-[#F5F3EF] leading-relaxed mb-3 font-normal">
              {shortAnswer.sampleHighScoringAnswer}
            </p>
            {shortAnswer.scoringCriteria?.length > 0 && (
              <div className="pt-2.5 border-t border-[#292E3B] text-xs">
                <span className="font-medium text-[#969CAB] block mb-1">Key Points Required for Full Credit:</span>
                <ul className="list-disc pl-4 space-y-1 text-[#969CAB]">
                  {shortAnswer.scoringCriteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QUESTION 3: CONCEPTUAL APPLICATION QUESTION */}
      <div className="bg-[#171B25] rounded-2xl p-5 sm:p-6 border border-[#292E3B] shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#10131B] text-[#A78BFA] border border-[#292E3B]">
            <span>Part 2.3 • Conceptual Application Question</span>
          </span>
          <button
            type="button"
            onClick={() => setShowApplicationSolution(!showApplicationSolution)}
            className="text-xs font-medium text-[#A78BFA] hover:text-[#bca4ff] flex items-center space-x-1 transition cursor-pointer"
          >
            {showApplicationSolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showApplicationSolution ? 'Hide Analysis' : 'Show Scenario Analysis'}</span>
          </button>
        </div>

        {/* Scenario Callout */}
        <div className="p-4 rounded-xl bg-[#10131B] border-l-2 border-[#A78BFA] border-y border-r border-[#292E3B] mb-3.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A78BFA] block mb-1">
            Real-World Scenario / Case Study:
          </span>
          <p className="text-xs sm:text-sm text-[#F5F3EF] leading-relaxed font-normal">
            {conceptualApplication.scenario}
          </p>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-[#F5F3EF] mb-3 leading-snug">
          {conceptualApplication.question}
        </h3>

        {/* Student thinking workspace */}
        <textarea
          rows={3}
          value={studentApplicationAnswer}
          onChange={(e) => setStudentApplicationAnswer(e.target.value)}
          placeholder="Analyze how the theory applies to this real-world scenario..."
          className="w-full p-3.5 rounded-xl border border-[#292E3B] focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA] text-sm text-[#F5F3EF] placeholder-[#969CAB]/40 bg-[#10131B] transition outline-none leading-relaxed"
        />

        {/* Expert Solution Toggle */}
        {showApplicationSolution && (
          <div className="mt-4 p-4 rounded-xl bg-[#10131B] text-[#F5F3EF] border border-[#292E3B]">
            <div className="flex items-center space-x-2 font-semibold text-xs uppercase tracking-wider text-[#A78BFA] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Expert Application Solution &amp; Deduction</span>
            </div>
            <p className="text-xs sm:text-sm text-[#969CAB] leading-relaxed font-normal">
              {conceptualApplication.sampleSolution}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
