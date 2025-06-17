import { courseInstructor } from "../coursService";

export type InstructorCoursesSortOption = "newest" | "title" | "popularity" | "rating";

export interface FindAllInstructorCoursesOptions {
  page: number;
  limit: number;
  search?: string;
  sort: InstructorCoursesSortOption;
}
export interface InstructorCoursesResponse {
  courses: courseInstructor[];
  totalPages: number;
  currentPage: number;
  totalCourses: number;
}