export interface TrainingStatus {
  needsRetraining: boolean;
  lastTrainedAt: Date | null;
  daysSinceLastTraining: number;
  newUsersCount: number;
  newCoursesCount: number;
  newEnrollmentsCount: number;
  recommendedAction: "train" | "retrain" | "up_to_date";
  trainingUrgency: "low" | "medium" | "high" | "critical";
}

export interface courseDataGenerale  {
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
  description: string;
  price: number;
  duration: number;
  InstructorId: string;
}