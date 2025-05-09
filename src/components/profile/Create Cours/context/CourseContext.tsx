import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CourseState, VideoFile, Coupon } from '../types';

type CourseAction =
  |{ type: 'INITIALIZE_COURSE'; payload: Partial<CourseState> }
  | { type: 'SET_COURSE_DETAILS'; payload: Partial<CourseState['courseDetails']> }
  | { type: 'SET_SECTIONS'; payload: CourseState['sections'] }
  | { type: 'ADD_SECTION'; payload: CourseState['sections'][0] }
  | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<CourseState['sections'][0]> } }
  | { type: 'REMOVE_SECTION'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: CourseState['sections'] }
  | { type: 'ADD_VIDEO_TO_SECTION'; payload: { sectionId: string; video: VideoFile } }
  | { type: 'UPDATE_VIDEO_IN_SECTION'; payload: { sectionId: string; videoId: string; updates: Partial<VideoFile> } }
  | { type: 'REMOVE_VIDEO_FROM_SECTION'; payload: { sectionId: string; videoId: string } }
  | { type: 'SET_QUIZ_QUESTIONS'; payload: CourseState['quizQuestions'] }
  | { type: 'ADD_QUIZ_QUESTION'; payload: CourseState['quizQuestions'][0] }
  | { type: 'UPDATE_QUIZ_QUESTION'; payload: { id: string; updates: Partial<CourseState['quizQuestions'][0]> } }
  | { type: 'REMOVE_QUIZ_QUESTION'; payload: string }
  | { type: 'REORDER_QUIZ_QUESTIONS'; payload: CourseState['quizQuestions'] }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_PRICING'; payload: Partial<CourseState['pricing']> }
  | { type: 'ADD_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON'; payload: string }
  | { type: 'PUBLISH_COURSE' };

const initialState: CourseState = {
  courseDetails: {
    title: '',
    thumbnail: null,
    thumbnailPreview: '',
    category: '',
    level: '',
    language: '',
    description: '',
  },
  sections: [],
  quizQuestions: [],
  currentStep: 0,
  isPublished: false,
  pricing: {
    price: 0,
    isFree: true,
  },
  coupons: [],
};

const courseReducer = (state: CourseState, action: CourseAction): CourseState => {
  switch (action.type) {
    case 'INITIALIZE_COURSE':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_COURSE_DETAILS':
      return {
        ...state,
        courseDetails: {
          ...state.courseDetails,
          ...action.payload,
        },
      };
    case 'SET_SECTIONS':
      return {
        ...state,
        sections: action.payload,
      };
    case 'ADD_SECTION':
      return {
        ...state,
        sections: [...state.sections, { ...action.payload, videos: [] }],
      };
    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.id
            ? { ...section, ...action.payload.updates }
            : section
        ),
      };
    case 'REMOVE_SECTION':
      return {
        ...state,
        sections: state.sections.filter((section) => section.id !== action.payload),
      };
    case 'REORDER_SECTIONS':
      return {
        ...state,
        sections: action.payload,
      };
    case 'ADD_VIDEO_TO_SECTION':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? { ...section, videos: [...section.videos, action.payload.video] }
            : section
        ),
      };
    case 'UPDATE_VIDEO_IN_SECTION':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? {
                ...section,
                videos: section.videos.map((video) =>
                  video.id === action.payload.videoId
                    ? { ...video, ...action.payload.updates }
                    : video
                ),
              }
            : section
        ),
      };
    case 'REMOVE_VIDEO_FROM_SECTION':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? {
                ...section,
                videos: section.videos.filter(
                  (video) => video.id !== action.payload.videoId
                ),
              }
            : section
        ),
      };
    case 'SET_QUIZ_QUESTIONS':
      return {
        ...state,
        quizQuestions: action.payload,
      };
    case 'ADD_QUIZ_QUESTION':
      return {
        ...state,
        quizQuestions: [...state.quizQuestions, action.payload],
      };
    case 'UPDATE_QUIZ_QUESTION':
      return {
        ...state,
        quizQuestions: state.quizQuestions.map((question) =>
          question.id === action.payload.id
            ? { ...question, ...action.payload.updates }
            : question
        ),
      };
    case 'REMOVE_QUIZ_QUESTION':
      return {
        ...state,
        quizQuestions: state.quizQuestions.filter(
          (question) => question.id !== action.payload
        ),
      };
    case 'REORDER_QUIZ_QUESTIONS':
      return {
        ...state,
        quizQuestions: action.payload,
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'SET_PRICING':
      return {
        ...state,
        pricing: {
          ...state.pricing,
          ...action.payload,
        },
      };
      case 'ADD_COUPON':
        return {
          ...state,
          coupons: [...state.coupons, action.payload],
        };
      case 'REMOVE_COUPON':
        return {
          ...state,
          coupons: state.coupons.filter(coupon => coupon.code !== action.payload),
        };
    case 'PUBLISH_COURSE':
      return {
        ...state,
        isPublished: true,
      };
    default:
      return state;
  }
};

interface CourseContextProps {
  state: CourseState;
  dispatch: React.Dispatch<CourseAction>;
}

const CourseContext = createContext<CourseContextProps | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  return (
    <CourseContext.Provider value={{ state, dispatch }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};