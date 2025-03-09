import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CourseState } from '../types';

type CourseAction =
  | { type: 'SET_COURSE_DETAILS'; payload: Partial<CourseState['courseDetails']> }
  | { type: 'SET_SECTIONS'; payload: CourseState['sections'] }
  | { type: 'ADD_SECTION'; payload: CourseState['sections'][0] }
  | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<CourseState['sections'][0]> } }
  | { type: 'REMOVE_SECTION'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: CourseState['sections'] }
  | { type: 'SET_VIDEOS'; payload: CourseState['videos'] }
  | { type: 'ADD_VIDEO'; payload: CourseState['videos'][0] }
  | { type: 'UPDATE_VIDEO'; payload: { id: string; updates: Partial<CourseState['videos'][0]> } }
  | { type: 'REMOVE_VIDEO'; payload: string }
  | { type: 'SET_QUIZ_QUESTIONS'; payload: CourseState['quizQuestions'] }
  | { type: 'ADD_QUIZ_QUESTION'; payload: CourseState['quizQuestions'][0] }
  | { type: 'UPDATE_QUIZ_QUESTION'; payload: { id: string; updates: Partial<CourseState['quizQuestions'][0]> } }
  | { type: 'REMOVE_QUIZ_QUESTION'; payload: string }
  | { type: 'REORDER_QUIZ_QUESTIONS'; payload: CourseState['quizQuestions'] }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_PRICING'; payload: Partial<CourseState['pricing']> }
  | { type: 'SET_VISIBILITY'; payload: CourseState['visibility'] }
  | { type: 'PUBLISH_COURSE' };

const initialState: CourseState = {
  courseDetails: {
    title: '',
    thumbnail: null,
    thumbnailPreview: '',
    category: '',
    level: '',
    description: '',
  },
  sections: [],
  videos: [],
  quizQuestions: [],
  currentStep: 0,
  isPublished: false,
  pricing: {
    price: 0,
    isFree: true,
  },
  visibility: 'private',
};

const courseReducer = (state: CourseState, action: CourseAction): CourseState => {
  switch (action.type) {
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
        sections: [...state.sections, action.payload],
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
    case 'SET_VIDEOS':
      return {
        ...state,
        videos: action.payload,
      };
    case 'ADD_VIDEO':
      return {
        ...state,
        videos: [...state.videos, action.payload],
      };
    case 'UPDATE_VIDEO':
      return {
        ...state,
        videos: state.videos.map((video) =>
          video.id === action.payload.id
            ? { ...video, ...action.payload.updates }
            : video
        ),
      };
    case 'REMOVE_VIDEO':
      return {
        ...state,
        videos: state.videos.filter((video) => video.id !== action.payload),
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
        quizQuestions: state.quizQuestions.filter((question) => question.id !== action.payload),
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
    case 'SET_VISIBILITY':
      return {
        ...state,
        visibility: action.payload,
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