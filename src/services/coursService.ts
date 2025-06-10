import axiosInstance from "./api";
import { CourseState } from "../components/profile/Create Cours/types";
import { Coupon } from "../components/profile/Create Cours/types/index";

// interface PaginatedResponse<T> {
//   data: T[];
//   total: number;
//   totalPages: number;
//   currentPage: number;
// }

interface CreateCoursePayload {
  title: string;
  description: string;
  thumbnailPreview: string;
  imgPublicId: string;
  level: string;
  language: string;
  pricing: {
    price: number;
    isFree: boolean;
  };
  oldPrice?: number;
  category: {
    name: string;
  };
  coupons?: Coupon[];
}

interface SectionData {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  isPreview: boolean;
  lectures: {
    id: string;
    title: string;
    description: string;
    duration: number;
    isPreview: boolean;
    videoUrl: string | "";
    publicId?: string;
  }[];
}

export interface QuizPayload {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
}
export interface QuizQuestion extends QuizPayload {
  id: string;
}
interface SectionPayload {
  id?: string;
  title: string;
  orderIndex: number;
  description: string;
  isPreview: boolean;
}
interface QuizToEdit {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
}
interface SectionToEdit {
  id: string;
  title: string;
  orderIndex: number;
  description: string;
  lectures: VideoToEdit[];
}
interface VideoToEdit {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  publicId: string;
}
interface VideoPayload {
  id?: string;
  title: string;
  duration: number;
  videoUrl: string;
  description: string;
  publicId: string;
  isPreview: boolean;
}
export interface courseInstructor {
  id: string;
  title: string;
  thumbnailPreview: string;
  category: string;
  level: string;
  language: string;
  reviews: number;
  students: number;
  instructorName?: string;
  instructorImg?: string;
  createdAt: Date;
}

export interface courseDataGenerale extends courseInstructor {
  description: string;
  price: number;
  duration: number;
  InstructorId: string;
}

export interface courseDataDetails extends courseDataGenerale {
  reviewsLenght: number;
  ratingsCount: number[];
  sections: SectionData[];
  instructorExpertise: string;
  instructorBiography: string;
  feedbacks: Review[];
}

export interface courseData extends courseDataDetails {
  description: string;
  certifications: number;
  progress?: number;
  completed?: boolean;
  completedAt?: Date | null;
  startedAt?: Date;
  isUserEnrolled: boolean;
  appliedCoupon?: { code: string; discountPercentage: number }
}

export interface Review {
  rating: number;
  comment: string;
  userName?: string;
  userImg?: string;
  createdAt: Date;
}

export interface courseToEdit extends CreateCoursePayload {
  id: string;
  oldPrice: number;
  sections: SectionToEdit[];
  quizQuestions: QuizToEdit[];
}

export const coursService = {
  createCours: async (courseState: CourseState) => {
    const payload: CreateCoursePayload = {
      title: courseState.courseDetails.title,
      description: courseState.courseDetails.description.replace(
        /<p>|<\/p>/g,
        ""
      ),
      thumbnailPreview: courseState.courseDetails.secureUrl!,
      imgPublicId: courseState.courseDetails.imgPublicId!,
      level: courseState.courseDetails.level,
      language: courseState.courseDetails.language,
      pricing: {
        price: courseState.pricing.isFree ? 0 : courseState.pricing.price,
        isFree: courseState.pricing.isFree,
      },
      oldPrice: courseState.pricing.isFree ? 0 : courseState.pricing.price,
      category: {
        name: courseState.courseDetails.category,
      },
      coupons: courseState.coupons,
    };

    const response = await axiosInstance.post(
      "/courses/create-course",
      payload
    );
    return response;
  },
  updateCours: async (courseState: CourseState) => {
    const payload: CreateCoursePayload = {
      title: courseState.courseDetails.title,
      description: courseState.courseDetails.description.replace(
        /<p>|<\/p>/g,
        ""
      ),
      thumbnailPreview: courseState.courseDetails.secureUrl!,
      imgPublicId: courseState.courseDetails.imgPublicId!,
      level: courseState.courseDetails.level,
      language: courseState.courseDetails.language,
      pricing: {
        price: courseState.pricing.isFree ? 0 : courseState.pricing.price,
        isFree: courseState.pricing.isFree,
      },
      oldPrice: courseState.pricing.isFree ? 0 : courseState.oldPrice,
      category: {
        name: courseState.courseDetails.category,
      },
      coupons: courseState.coupons,
    };

    const response = await axiosInstance.put(
      `/courses/${courseState.id}/update-course`,
      payload
    );
    return response;
  },
  createSection: async (courseId: string, sectionData: SectionPayload) => {
    const response = await axiosInstance.post(
      `/courses/${courseId}/sections/create-section`,
      sectionData
    );
    return response;
  },
  createVideo: async (
    courseId: string,
    sectionId: string,
    VideoData: VideoPayload
  ) => {
    const response = await axiosInstance.post(
      `/courses/${courseId}/sections/${sectionId}/lectures/create-lecture`,
      VideoData
    );
    return response;
  },
  createQuiz: async (courseId: string, QuizData: QuizPayload) => {
    const response = await axiosInstance.post(
      `/courses/${courseId}/exams/create-exam`,
      QuizData
    );
    return response;
  },
  getQuiz: async (courseId: string) => {
    const response = await axiosInstance.get<QuizQuestion[]>(
      `/courses/${courseId}/exams`
    );
    return response;
  },
  publishCours: async (courseId: string, publicIds: string[]) => {
    const response = await axiosInstance.put(
      `/courses/${courseId}/publish`,
      publicIds
    );
    return response;
  },
  getInstructorCourses: async () => {
    const response = await axiosInstance.get<courseInstructor[]>(
      "/courses/instructor/my-courses"
    );
    return response.data;
  },
  getGeneralDataCourses: async (
    currentPage: number,
    limit: number,
    sortOption?: string,
    filterParams?: {
      ratings?: number[] | undefined;
      instructors?: string[] | undefined;
      price?: string | undefined;
      levels?: string[] | undefined;
      categories?: string[] | undefined;
      search?: string | undefined;
    }
  ) => {
    console.log("filterParams", filterParams);
    if (filterParams?.levels && filterParams.levels.length > 0) {
      filterParams.levels.map(level => {
        if (level === "All Levels") {
          delete filterParams.levels;
        }
      })
    }
    const response = await axiosInstance.get<{
      courses: courseDataGenerale[];
      totalCount: number;
    }>("/courses", {
      params: {
        currentPage,
        limit,
        sortOption: sortOption,
        filterParams: filterParams,
      },
    });

    console.log("JJJJJJJJJJ", response.data.courses);
    return response.data;
  },
  deleteCours: async (courseId: string) => {
    const response = await axiosInstance.delete(`/courses/delete/${courseId}`);
    return response;
  },
  getCourseDetails: async (courseId: string) => {
    const response = await axiosInstance.get<courseData>(
      `/courses/${courseId}`
    );
    return response.data;
  },
  verifyCoupon: async (courseId: string, couponCode: string) => {
    const response = await axiosInstance.post<number>(
      "/courses/verify-coupon",
      { courseId, couponCode }
    );
    return response.data;
  },
  checkEnrollment: async (courseId: string) => {
    const response = await axiosInstance.get<boolean>(
      `/courses/${courseId}/check-enrollment`
    );
    return response.data;
  },
  rateCourse: async (courseId: string, review: Review) => {
    const response = await axiosInstance.post<string>(
      `/courses/${courseId}/add-review`,
      { rating: review.rating, text: review.comment }
    );
    return response.data;
  },

  getCourseToEdit: async (courseId: string) => {
    const response = await axiosInstance.get<courseToEdit>(
      `/courses/${courseId}/update-course`
    );
    return response.data;
  },

  // Frontend API service
  getPopularCourses: async (
    avgRating?: number,
    page?: number,
    limit?: number,
    category?: string
  ) => {
    const response = await axiosInstance.get<{
      data: courseDataGenerale[];
      totalCount: number;
    }>("/popular-courses", {
      params: {
        avgRating,
        page,
        limit,
        category: category === "All" ? undefined : category,
      },
    });
    return response.data;
  },

  getTrendingCourses: async (
    limit?: number,
    page?: number,
    category?: string
  ) => {
    const response = await axiosInstance.get<{
      data: courseDataGenerale[];
      totalCount: number;
    }>("/trending-courses", {
      params: {
        limit,
        page,
        category: category === "All" ? undefined : category,
      },
    });
    return response.data;
  },

  getCoursesFilteringData: async () => {
    const response = await axiosInstance.get<{categories: string[], levels: string[], instructors: {userName: string, id: string}[]}>("/categories");
    return response.data;
  },
};
