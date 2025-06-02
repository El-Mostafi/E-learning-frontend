// src/services/courseProgressService.ts
export interface LectureProgress {
  lectureId: string;
  isCompleted: boolean;
  lastWatchedPosition: number;
}

export interface CourseProgress {
  courseId: string;
  completedLectures: string[];
  totalLectures: number;
  lastWatchedLectureId: string;
}

// Mock API service for course progress
const courseProgressService = {
  // Get user's progress for a specific course
  getProgress: async (courseId: string): Promise<CourseProgress> => {
    // In a real application, this would be an API call
    console.log('Fetching progress for course:', courseId);
    
    // Mock response - simulate retrieving from localStorage for demo
    const savedProgress = localStorage.getItem(`course_progress_${courseId}`);
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    
    // Default empty progress
    return {
      courseId,
      completedLectures: [],
      totalLectures: 0,
      lastWatchedLectureId: ''
    };
  },
  
  // Update progress for a lecture
  updateLectureProgress: async (
    courseId: string, 
    lectureId: string, 
    isCompleted: boolean,
    totalLectures: number
  ): Promise<CourseProgress> => {
    // Get existing progress
    const progress = await courseProgressService.getProgress(courseId);
    
    // Update completed lectures array
    if (isCompleted && !progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId);
    } else if (!isCompleted && progress.completedLectures.includes(lectureId)) {
      progress.completedLectures = progress.completedLectures.filter(id => id !== lectureId);
    }
    
    // Update last watched lecture
    progress.lastWatchedLectureId = lectureId;
    progress.totalLectures = totalLectures;
    
    // Save to localStorage for demo purposes
    localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(progress));
    
    return progress;
  },
  
  // Check if user has purchased a course
  hasUserPurchasedCourse: async (courseId: string): Promise<boolean> => {
    // In a real application, this would check against user's purchases
    // For demo purposes, we'll use localStorage to simulate purchase state
    const purchased = localStorage.getItem(`purchased_course_${courseId}`);
    return Promise.resolve(!purchased);
  },
  
  // Mark course as purchased (for demo)
  markCoursePurchased: (courseId: string): void => {
    localStorage.setItem(`purchased_course_${courseId}`, 'true');
  }
};

export default courseProgressService;