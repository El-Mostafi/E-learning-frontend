import axiosInstance from "./api";



interface Enrollment {
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



export interface courseData {
  id: string;
  title: string;
  thumbnailPreview: string;
  category: string;
  level: string;
  language: string;
  reviews: number;
  students: number;
  instructorName: string;
  instructorImg: string;
  createdAt: Date;
  completedSections: number;
  lectureTotal: number; 
  description: string;
  price: number;
  duration: number;
  progress: number;
  completed: boolean;
  completedAt: Date | null;
  startedAt: Date;
}

export interface Category {
  name: string;
}



export const enrollmentService = {
  enroll: async (courseId: string, userId: string) => {
    return await axiosInstance.post<{ message: string }>(
      `/courses/${courseId}/enroll`,
      {
        userId,
      }
    );
  },

  getEnrolledCourses: async () => {
    const response = await axiosInstance.get<courseData[]>(
      "/my-courses/enrolled"
    );
    const courses: courseData[] = response.data;
    return courses;
  },

  getEnrolledCourseById: async (courseId: string) => {
    const response = await axiosInstance.get<Enrollment>(
      `/my-courses/enrolled/${courseId}`
    );
    return response.data;
  },

  withdrawFromCourse: async (courseId: string) => {
    return await axiosInstance.delete<{ message: string }>(
      `/my-courses/${courseId}/enrollment/withdraw`
    );
  },

  updateProgress: async (courseId: string, sectionId: string, lectureId: string) => {
    const response = await axiosInstance.put<Enrollment>(
      `/my-courses/enrolled/${courseId}/update-progress/${sectionId}/${lectureId}`
    );
    return response.data;
  },
  markQuizPassed: async (courseId: string, score: number) => {
    const response = await axiosInstance.put<Enrollment>(
      `/my-courses/enrolled/${courseId}/quiz-pass`,
      { score }
    );
    return response.data;
  },
};
