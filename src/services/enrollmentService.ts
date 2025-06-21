import axiosInstance from "./api";
import { courseStudentTable, EnrolledCoursesResponse, Enrollment, GetEnrolledCoursesOptions } from "./interfaces/enrollment.interface";

export const enrollmentService = {
  enroll: async (courseId: string) => {
    return await axiosInstance.post<{ message: string }>(
      `/courses/${courseId}/enroll`
    );
  },

  getEnrolledCoursesOverview: async () => {
    const response = await axiosInstance.get<courseStudentTable[]>(
      "/my-courses/overview"
    );
    const courses: courseStudentTable[] = response.data;
    return courses;
  },
  getEnrolledCourses: async (
    options: GetEnrolledCoursesOptions
  ): Promise<EnrolledCoursesResponse> => {
    const response = await axiosInstance.get<EnrolledCoursesResponse>(
      "/my-courses/enrolled",
      {
        params: {
          page: options.page,
          limit: options.limit,
          sort: options.sort,
          ...(options.search && { search: options.search }),
        },
      }
    );
    return response.data;
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

  updateProgress: async (
    courseId: string,
    sectionId: string,
    lectureId: string
  ) => {
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
  getMyEnrollmentsIds: async () => {
    const response = await axiosInstance.get<{
      success : true,
      courses: string[]
    }>(
      "/my-courses/enrolled/ids"
    );
    return response.data.courses;
  },
};
