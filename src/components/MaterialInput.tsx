import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileCode,
} from 'lucide-react';
import { DifficultyLevel } from '../types';
import { SAMPLE_MATERIALS, SampleMaterial } from '../data/sampleMaterials';
import { fileToBase64, formatFileSize } from '../utils/fileUtils';

interface UploadedImage {
  name: string;
  size: number;
  mimeType: string;
  data: string; // base64
  previewUrl: string;
}

interface MaterialInputProps {
  onGenerate: (payload: {
    materialText: string;
    images: { mimeType: string; data: string }[];
    difficulty: DifficultyLevel;
  }) => Promise<void>;
  isLoading: boolean;
}

export const MaterialInput: React.FC<MaterialInputProps> = ({ onGenerate, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'samples'>('text');
  const [materialText, setMaterialText] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('Analyzing material...');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError(null);
    const files = Array.from(e.target.files);

    try {
      const newImages: UploadedImage[] = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          setError(`"${file.name}" is not an image file. Please upload JPG, PNG, or WEBP images.`);
          continue;
        }
        if (file.size > 15 * 1024 * 1024) {
          setError(`"${file.name}" exceeds 15MB. Please upload a smaller image.`);
          continue;
        }
        const b64 = await fileToBase64(file);
        newImages.push({
          name: file.name,
          size: file.size,
          mimeType: b64.mimeType,
          data: b64.data,
          previewUrl: URL.createObjectURL(file),
        });
      }
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    } catch (err) {
      console.error(err);
      setError('Could not process the selected image(s).');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectSample = (sample: SampleMaterial) => {
    setMaterialText(sample.content);
    setDifficulty(sample.difficulty);
    setActiveTab('text');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!materialText.trim() && images.length === 0) {
      setError('Please provide study material: enter or paste lecture notes, or upload document images.');
      return;
    }

    try {
      setLoadingStep('Ingesting and parsing study material...');
      const stepTimer1 = setTimeout(() => {
        setLoadingStep('Extracting 3–5 core concepts & plain-language summaries...');
      }, 1500);
      const stepTimer2 = setTimeout(() => {
        setLoadingStep(`Formulating 3 ${difficulty.toUpperCase()} exam questions (MCQ, Short Answer, Applied)...`);
      }, 3500);
      const stepTimer3 = setTimeout(() => {
        setLoadingStep('Synthesizing 5–10 high-retention flashcards strictly from source...');
      }, 5500);

      await onGenerate({
        materialText: materialText.trim(),
        images: images.map((img) => ({ mimeType: img.mimeType, data: img.data })),
        difficulty,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate study kit. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Editorial Welcome Section */}
      <div className="text-center mb-9">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#171B25] border border-[#292E3B] text-[#75C9B2] text-xs font-medium mb-4 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-[#75C9B2]" />
          <span>Strict Academic Grounding • Zero External Hallucinations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F5F3EF] tracking-tight">
          Transform Your Notes into an <br className="hidden sm:inline" />
          <span className="text-[#A78BFA]">Exam-Ready Study Kit</span>
        </h1>
        <p className="mt-3 text-[#969CAB] text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
          Input raw lecture notes, syllabus chapters, or document photos. Receive 3–5 core concept summaries, 3 calibrated exam questions, and 5–10 interactive flashcards.
        </p>
      </div>

      {/* Main Input Container Card */}
      <div className="bg-[#171B25] rounded-2xl border border-[#292E3B] shadow-2xl overflow-hidden">
        {/* Top Tab Bar (Linear Segmented Switcher) */}
        <div className="flex border-b border-[#292E3B] bg-[#10131B] p-2 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[#1D2230] text-[#F5F3EF] border border-[#292E3B] shadow-sm'
                : 'text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#171B25]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Paste Notes / Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === 'image'
                ? 'bg-[#1D2230] text-[#F5F3EF] border border-[#292E3B] shadow-sm'
                : 'text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#171B25]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#75C9B2]" />
            <span>Upload Document Images</span>
            {images.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/30 font-semibold">
                {images.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === 'samples'
                ? 'bg-[#1D2230] text-[#F5F3EF] border border-[#292E3B] shadow-sm'
                : 'text-[#969CAB] hover:text-[#F5F3EF] hover:bg-[#171B25]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Sample Topics</span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="p-5 sm:p-7">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#1D2230] border border-rose-500/40 text-[#F5F3EF] text-xs sm:text-sm flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-300">Action Required</p>
                <p className="text-[#969CAB] mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* TAB 1: TEXT INPUT */}
          {activeTab === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label htmlFor="material-text" className="text-xs font-semibold uppercase tracking-wider text-[#969CAB]">
                  Source Lecture Material &amp; Study Notes
                </label>
                <div className="flex items-center space-x-3 text-xs text-[#969CAB]">
                  <span>{materialText.length.toLocaleString()} characters</span>
                  {materialText && (
                    <button
                      type="button"
                      onClick={() => setMaterialText('')}
                      className="text-[#969CAB] hover:text-rose-400 font-medium transition cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <textarea
                id="material-text"
                rows={9}
                value={materialText}
                onChange={(e) => setMaterialText(e.target.value)}
                placeholder="Paste lecture notes, study outlines, textbook chapters, or syllabus text here...&#10;&#10;The tutor will parse the core concepts and formulate exam questions strictly based on this source."
                className="w-full p-4 rounded-xl border border-[#292E3B] focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA] text-[#F5F3EF] text-sm font-sans placeholder-[#969CAB]/40 bg-[#10131B] focus:bg-[#10131B] transition outline-none leading-relaxed"
              />
              <p className="mt-2 text-xs text-[#969CAB] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#75C9B2]" />
                <span>Strictly grounded: No external facts or unsupported questions will be generated.</span>
              </p>
            </div>
          )}

          {/* TAB 2: IMAGE UPLOADS */}
          {activeTab === 'image' && (
            <div>
              <div className="mb-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#969CAB] block">
                  Document Images (Notes, Whiteboards, Slides, Textbook Pages)
                </label>
                <p className="text-xs text-[#969CAB] mt-0.5">
                  Supports JPEG, PNG, and WEBP. Multimodal vision parses handwriting and printed text.
                </p>
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[#292E3B] hover:border-[#A78BFA]/60 bg-[#10131B]/50 hover:bg-[#10131B] rounded-xl p-8 text-center cursor-pointer transition duration-150 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-lg bg-[#1D2230] border border-[#292E3B] text-[#A78BFA] flex items-center justify-center mx-auto mb-3 group-hover:border-[#A78BFA]/50 group-hover:scale-105 transition">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-[#F5F3EF]">
                  Click to browse or drag and drop note captures
                </p>
                <p className="text-xs text-[#969CAB] mt-1">
                  Upload up to 5 clear document photos or slide screenshots
                </p>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#969CAB] mb-2.5">
                    Attached Document Images ({images.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl border border-[#292E3B] overflow-hidden bg-[#10131B] shadow-sm"
                      >
                        <img
                          src={img.previewUrl}
                          alt={img.name}
                          className="w-full h-28 object-cover group-hover:opacity-90 transition"
                        />
                        <div className="p-2.5 bg-[#171B25] border-t border-[#292E3B] flex items-center justify-between text-xs">
                          <span className="truncate max-w-[110px] font-medium text-[#F5F3EF]" title={img.name}>
                            {img.name}
                          </span>
                          <span className="text-[#969CAB] text-[10px]">{formatFileSize(img.size)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-md bg-[#0B0D12]/80 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAMPLE TOPICS */}
          {activeTab === 'samples' && (
            <div>
              <div className="mb-3.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#969CAB] block">
                  Select a Pre-Loaded Sample Topic
                </label>
                <p className="text-xs text-[#969CAB] mt-0.5">
                  Explore how the academic tutor processes authentic university study material instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_MATERIALS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-4 rounded-xl border border-[#292E3B] hover:border-[#A78BFA]/50 bg-[#10131B] hover:bg-[#1D2230] cursor-pointer transition text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#171B25] text-[#969CAB] border border-[#292E3B]">
                        {sample.subject}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                          sample.difficulty === 'hard'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : sample.difficulty === 'medium'
                            ? 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/30'
                            : 'bg-[#75C9B2]/10 text-[#75C9B2] border-[#75C9B2]/30'
                        }`}
                      >
                        {sample.difficulty}
                      </span>
                    </div>
                    <h4 className="font-medium text-[#F5F3EF] group-hover:text-[#A78BFA] text-sm transition">
                      {sample.title}
                    </h4>
                    <p className="text-xs text-[#969CAB] mt-1.5 line-clamp-2 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIFFICULTY SEGMENTED CONTROL WITH ACCESSIBLE RADIO BUTTONS */}
          <div className="mt-7 pt-6 border-t border-[#292E3B]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3.5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F5F3EF] block">
                  Question Difficulty Level
                </span>
                <span className="text-xs text-[#969CAB]">
                  Calibrates the 3 practice questions and flashcard depth
                </span>
              </div>
              <span className="text-[11px] text-[#A78BFA] font-medium">Segmented Radio Control</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3" role="radiogroup" aria-label="Question Difficulty Level">
              {/* EASY OPTION */}
              <label
                className={`relative flex flex-col p-3 rounded-xl border transition cursor-pointer select-none ${
                  difficulty === 'easy'
                    ? 'border-[#75C9B2] bg-[#1D2230] shadow-sm'
                    : 'border-[#292E3B] bg-[#10131B] hover:border-[#3B4254]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs sm:text-sm text-[#F5F3EF] flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#75C9B2]" />
                    <span>Easy</span>
                  </span>
                  <input
                    type="radio"
                    name="question-difficulty"
                    value="easy"
                    checked={difficulty === 'easy'}
                    onChange={() => setDifficulty('easy')}
                    className="w-3.5 h-3.5 text-[#75C9B2] focus:ring-0 focus:outline-none accent-[#75C9B2] cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#969CAB] leading-tight">
                  Core definitions &amp; direct recall.
                </p>
              </label>

              {/* MEDIUM OPTION */}
              <label
                className={`relative flex flex-col p-3 rounded-xl border transition cursor-pointer select-none ${
                  difficulty === 'medium'
                    ? 'border-[#A78BFA] bg-[#1D2230] shadow-sm'
                    : 'border-[#292E3B] bg-[#10131B] hover:border-[#3B4254]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs sm:text-sm text-[#F5F3EF] flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                    <span>Medium</span>
                  </span>
                  <input
                    type="radio"
                    name="question-difficulty"
                    value="medium"
                    checked={difficulty === 'medium'}
                    onChange={() => setDifficulty('medium')}
                    className="w-3.5 h-3.5 text-[#A78BFA] focus:ring-0 focus:outline-none accent-[#A78BFA] cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#969CAB] leading-tight">
                  Mechanisms &amp; analytical relationships.
                </p>
              </label>

              {/* HARD OPTION */}
              <label
                className={`relative flex flex-col p-3 rounded-xl border transition cursor-pointer select-none ${
                  difficulty === 'hard'
                    ? 'border-rose-400 bg-[#1D2230] shadow-sm'
                    : 'border-[#292E3B] bg-[#10131B] hover:border-[#3B4254]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs sm:text-sm text-[#F5F3EF] flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Hard</span>
                  </span>
                  <input
                    type="radio"
                    name="question-difficulty"
                    value="hard"
                    checked={difficulty === 'hard'}
                    onChange={() => setDifficulty('hard')}
                    className="w-3.5 h-3.5 text-rose-400 focus:ring-0 focus:outline-none accent-rose-400 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#969CAB] leading-tight">
                  Deductions &amp; edge-case scenarios.
                </p>
              </label>
            </div>
          </div>

          {/* PRIMARY GENERATE BUTTON */}
          <div className="mt-7">
            <button
              type="button"
              disabled={isLoading || (!materialText.trim() && images.length === 0)}
              onClick={handleSubmit}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base transition duration-150 flex items-center justify-center space-x-2 cursor-pointer shadow-lg ${
                isLoading || (!materialText.trim() && images.length === 0)
                  ? 'bg-[#1D2230] text-[#969CAB] border border-[#292E3B] cursor-not-allowed shadow-none'
                  : 'bg-[#A78BFA] hover:bg-[#b89eff] active:scale-[0.99] text-[#0B0D12] shadow-[#A78BFA]/10'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0B0D12]/30 border-t-[#0B0D12] rounded-full animate-spin" />
                  <span className="font-medium text-[#0B0D12]">{loadingStep}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Study Kit</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
