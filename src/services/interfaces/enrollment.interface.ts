export interface Enrollment {
  course: string;
  participant: string;
  completedSections: completedSection[]; 
  progress: number;
  completed: boolean;
  completedAt: Date | null;
  startedAt: Date;
  hasPassedQuizze: boolean;
  QuizzeScore: number;
}
export interface completedSection {
  sectionId: string;
  lectureId: string;
  completedAt: Date;
}



export interface courseStudentTable {
  id: string;
  title: string;
  thumbnailPreview: string;
  progress: number;
  completed: boolean;
}


export type EnrolledCoursesSortOption = "newest" | "title" | "progress" | "rating";

// Options to be passed to our service function
export interface GetEnrolledCoursesOptions {
  page: number;
  limit: number;
  search?: string;
  sort: EnrolledCoursesSortOption;
}

// The shape of a single enrolled course object returned by the API
export interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  language: string;
  thumbnailPreview: string;
  category: string;
  level: string;
  price: number;
  reviews: number; // This is the average rating
  duration: number;
  students: number; // Total students in the course
  instructorName: string;
  instructorImg: string | null;
  createdAt: string; // ISO date string
  lectureTotal: number;
  completedSections: number;
  completed: boolean;
  completedAt: string | null; // ISO date string
  startedAt: string; // ISO date string
  progress: number;
}

// The shape of the entire API response object
export interface EnrolledCoursesResponse {
  courses: EnrolledCourse[];
  totalPages: number;
  currentPage: number;
  totalCourses: number;
}
