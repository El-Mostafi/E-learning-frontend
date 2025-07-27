import axiosInstance from "./api";
import { CourseState } from "../components/profile/Create Cours/types";
import { Coupon } from "../components/profile/Create Cours/types/index";
import {
  FindAllInstructorCoursesOptions,
  InstructorCoursesResponse,
} from "./interfaces/course.interface";

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
  _id: string;
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
  appliedCoupon?: { code: string; discountPercentage: number };
}

export interface Review {
  rating: number;
  comment: string;
  userName?: string;
  userImg?: string;
  createdAt: Date;
  course?: string;
}

export interface courseToEdit extends CreateCoursePayload {
  id: string;
  oldPrice: number;
  sections: SectionToEdit[];
  quizQuestions: QuizToEdit[];
}
export interface Course {
  id: string;
  title: string;
  numberOfSections: number;
  category: string;
  instructor: string;
  numberOfStudents: number;
  averageRating: number;
  revenue: number;
  status: "Published" | "Draft";
  createdAt: string;
}

export interface GetAllCoursesResponse {
  courses: Course[];
  totalPages: number;
  currentPage: number;
  totalCourses: number;
}
interface options {
  page: number;
  limit: number;
  status: string | undefined;
  search: string | undefined;
  category: string | undefined;
  level: string | undefined;
  language: string | undefined;
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
  getInstructorCourses: async (options: FindAllInstructorCoursesOptions) => {
    const response = await axiosInstance.get<InstructorCoursesResponse>(
      "/courses/instructor/my-courses",
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
      filterParams.levels.map((level) => {
        if (level === "All Levels") {
          delete filterParams.levels;
        }
      });
    }
    const response = await axiosInstance.get<{
      courses: courseDataGenerale[];
      totalCount: number;
    }>("/courses", {
      params: {
        currentPage,
        limit,
        sortOption: sortOption,
        filterParams: filterParams ? JSON.stringify(filterParams) : undefined,
      },
    });

    console.log("JJJJJJJJJJ", response.data.courses);
    return response.data;
  },
  deleteCours: async (courseId: string) => {
    const response = await axiosInstance.delete(`/courses/delete/${courseId}`);
    return response;
  },
  getCourseDetails: async (courseId: string, userId?: string) => {
    const response = await axiosInstance.get<courseData>(
      `/courses/${courseId}`,
      {
        params: {
          userId: userId,
        },
      }
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
  getAllCategories: async () => {
    const response = await axiosInstance.get<string[]>("/courses/categories");
    return response.data;
  },
  getAllCourses: async (options: options): Promise<GetAllCoursesResponse> => {
    const response = await axiosInstance.get<GetAllCoursesResponse>(
      "/courses/overview",
      {
        params: {
          page: options.page,
          limit: options.limit,
          status: options.status,
          search: options.search,
          category: options.category,
          level: options.level,
          language: options.language,
        },
      }
    );
    return response.data;
  },
  togglePublishCourse: async (courseId: string) => {
    const response = await axiosInstance.put(
      `/courses/${courseId}/toggle-publish`
    );
    return response.data;
  },
  getAllLanguages: async () => {
    const response = await axiosInstance.get<string[]>("/courses/languages");
    return response.data;
  },
  getCoursesFilteringData: async () => {
    const response = await axiosInstance.get<{
      categories: string[];
      levels: string[];
      instructors: { userName: string; id: string }[];
    }>("/categories");
    return response.data;
  },
  getCoursesCount: async () => {
    const response = await axiosInstance.get<{ count: number }>("/courses/published/count");
    return response.data;
  },
  downloadCertificate: async (courseId: string) => {
    try {
      const response = await axiosInstance.get(`/generate-certificate/${courseId}`, {
        responseType: 'blob',
      });
      const blob = response.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Use filename from Content-Disposition header if available
    const disposition = response.headers['content-disposition'];
    let filename = 'certificate.pdf';
    if (disposition && disposition.indexOf('filename=') !== -1) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading certificate:', error);
  }
},

  fetchCertificatePdf: async (
    courseId: string,
    courseTitle: string
  ): Promise<CertificateData> => {
    try {
      const response = await axiosInstance.get(
        `/generate-certificate/${courseId}`,
        {
          responseType: "blob",
        }
      );

      // Validate the response from the server
      if (
        !(response.data instanceof Blob) ||
        response.data.type !== "application/pdf"
      ) {
        throw new Error("Server did not return a valid PDF file.");
      }

      const blob = response.data;

      // Default filename in case the header is missing
      let filename = `${courseTitle
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_certificate.pdf`;

      // Try to get filename from the 'content-disposition' header
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      return { blob, filename };
    } catch (error) {
      console.error(
        `Failed to fetch certificate PDF for course ${courseId}:`,
        error
      );
      // Re-throw the error so the component can handle it
      throw error;
    }
  },
};

export interface CertificateData {
  blob: Blob;
  filename: string;
}
