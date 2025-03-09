export interface CourseDetails {
  title: string;
  thumbnail: File | null;
  thumbnailPreview: string;
  category: string;
  level: string;
  description: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
}

export interface VideoFile {
  id: string;
  file: File;
  progress: number;
  preview: string;
  error?: string;
  duration?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D' | '';
}

export interface CourseState {
  courseDetails: CourseDetails;
  sections: Section[];
  videos: VideoFile[];
  quizQuestions: QuizQuestion[];
  currentStep: number;
  isPublished: boolean;
  pricing: {
    price: number;
    isFree: boolean;
  };
  visibility: 'public' | 'private' | 'unlisted';
}