import axiosInstance from "./api";


export interface TopReview {
  _id: string;
  text: string;
  rating: number;
  createdAt: Date;
  user: {
    name: string;
    image: string;
  };
  course: {
    _id: string;
    title: string;
  };
}

const reviewService = {
    getTopReviews: async () => {
        const response = await axiosInstance.get<TopReview[]>('/reviews/top-reviews');
        return response.data;
    },
    getReviewsCount: async () => {
        const response = await axiosInstance.get<{ totalCount: number }>('/reviews/count');
        console.log("WAReviews:", response.data.totalCount);
        return response.data.totalCount;

    }
}

export default reviewService;
