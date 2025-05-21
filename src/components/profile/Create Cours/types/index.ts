export interface CourseDetails {
  title: string;
  thumbnail: File | null;
  thumbnailPreview: string;
  imgPublicId?: string;
  secureUrl?: string;
  category: string;
  level: string;
  language: string;
  description: string;
}

export interface VideoFile {
  id: string;
  publicId: string;
  file?: File;
  secureUrl: string;
  progress: number;
  preview: string;
  error?: string;
  duration: number;
  title: string;
  description: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  videos: VideoFile[];
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
  correctAnswer: 'A' | 'B' | 'C' | 'D' ;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxUses: number;
  expiryDate: Date;
}

export interface CourseState {
  id?: string;
  courseDetails: CourseDetails;
  sections: Section[];
  quizQuestions: QuizQuestion[];
  currentStep: number;
  isPublished: boolean;
  pricing: {
    price: number;
    isFree: boolean;
  };
  oldPrice?: number;
  coupons: Coupon[];
}