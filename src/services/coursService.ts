import axiosInstance from "./api";
import { CourseState } from "../components/profile/Create Cours/types";
import { Coupon } from "../components/profile/Create Cours/types/index";
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

interface CreateQuizPayload {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
}
interface CreateSectionPayload {
  title: string;
  orderIndex: number;
  description: string;
  isPreview: boolean;
}
interface CreateVideoPayload {
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
  sections: SectionData[];
  certifications: number;
  progress?: number;
  completed?: boolean;
  completedAt?: Date | null;
  startedAt?: Date;
  isUserEnrolled: boolean;
}



export interface Review {
  rating: number;
  comment: string;
  userName?: string;
  userImg?: string;
  createdAt: Date;
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
  createSection: async (
    courseId: string,
    sectionData: CreateSectionPayload
  ) => {
    const response = await axiosInstance.post(
      `/courses/${courseId}/sections/create-section`,
      sectionData
    );
    return response;
  },
  createVideo: async (
    courseId: string,
    sectionId: string,
    VideoData: CreateVideoPayload
  ) => {
    const response = await axiosInstance.post(
      `/courses/${courseId}/sections/${sectionId}/lectures/create-lecture`,
      VideoData
    );
    return response;
  },
  createQuiz: async (courseId: string, QuizData: CreateQuizPayload) => {
    const response = await axiosInstance.post(
      `/courses/${courseId}/exams/create-exam`,
      QuizData
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
  getGeneralDataCourses: async () => {
    const response = await axiosInstance.get<courseDataGenerale[]>("/courses");
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
      {rating: review.rating, text: review.comment}
    );
    return response.data;
  }
};
