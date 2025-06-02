// src/services/courseReviewService.ts
export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userImg?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CourseReviewSubmit {
  courseId: string;
  rating: number;
  comment: string;
}

// Mock API service for course reviews
const courseReviewService = {
  // Get reviews for a course
  getReviews: async (courseId: string): Promise<CourseReview[]> => {
    // In a real application, this would be an API call
    console.log('Fetching reviews for course:', courseId);
    
    // Mock response
    return Promise.resolve([
      // This would normally come from your API
    ]);
  },
  
  // Submit a review for a course
  submitReview: async (review: CourseReviewSubmit): Promise<CourseReview> => {
    // In a real application, this would be an API call
    console.log('Submitting review:', review);
    
    // Mock response - simulating a successful submission
    return Promise.resolve({
      id: `review-${Date.now()}`,
      courseId: review.courseId,
      userId: 'current-user-id', // This would come from auth context
      userName: 'Current User', // This would come from auth context
      userImg: 'https://i.pravatar.cc/150?img=11', // Mock avatar
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date().toISOString()
    });
  }
};

export default courseReviewService;