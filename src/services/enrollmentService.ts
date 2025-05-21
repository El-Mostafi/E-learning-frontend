import axiosInstance from "./api";



interface Enrollment {
  course: string;
  participant: string;
  progress: number;
  completed: boolean;
  completedAt: Date | null;
  startedAt: Date;
}

export interface courseData {
  id: string;
  title: string;
  description: string;
  thumbnailPreview: string;
  level: string;
  language: string;
  category: Category;
  reviews: Review[];
  rating?: number;
  sections: SectionData[];
  completedSections: {
    sectionId: string;
    lectureId: string;
  }[];
  certifications: number;
  students: number;
  instructorName: string;
  instructorImg: string;
  progress: number;
  completed: boolean;
  completedAt: Date | null;
  startedAt: Date;
}

export interface Category {
  name: string;
}

export interface Review {
  userName?: string;
  userImg?: string;
  course?: string;
  text: string;
  rating: number;
  createdAt: Date;
}

interface SectionData {
  id: string;
  title: string;
  orderIndex: number;
  isPreview: boolean;
  lectures: LectureData[];
}
interface LectureData {
  _id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  publicId: string;
  isPreview: boolean;
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
};
