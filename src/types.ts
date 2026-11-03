export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface KeyConcept {
  concept: string;
  explanation: string;
}

export interface McqQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ShortAnswerQuestion {
  question: string;
  sampleHighScoringAnswer: string;
  scoringCriteria: string[];
}

export interface ConceptualApplicationQuestion {
  question: string;
  scenario: string;
  sampleSolution: string;
}

export interface PracticeQuestions {
  mcq: McqQuestion;
  shortAnswer: ShortAnswerQuestion;
  conceptualApplication: ConceptualApplicationQuestion;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudyKit {
  id: string;
  createdAt: string;
  title: string;
  difficulty: DifficultyLevel;
  keyConcepts: KeyConcept[];
  practiceQuestions: PracticeQuestions;
  flashcards: Flashcard[];
  markdownLayout: string;
}

export interface AnswerEvaluation {
  score: number;
  verdict: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}
