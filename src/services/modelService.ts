import axiosInstance from './api';
import { courseDataGenerale, TrainingStatus } from './interfaces/model.interface';



const ModelService = {
  
  getTrainingStatus: async (): Promise<{
      success: true,
      data: TrainingStatus
    }> => {
      const response = await axiosInstance.get<{
      success: true,
      data: TrainingStatus
    }>('/model/training-status');
      return response.data; 
  },

  TrainModel: async (): Promise<{
      success: true,
      message: string,
      stats: TrainingStatus
      }> => {
      const response = await axiosInstance.post<{
      success: true,
      message: string,
      stats: TrainingStatus
      }>("/train-model");
      return response.data; 
  },
  getRecommendedCourses: async (userId: string, limit: number): Promise<{
      success: true,
      data: courseDataGenerale[]
      }> => {
      const response = await axiosInstance.get<{
      success: true,
      data: courseDataGenerale[]
      }>(`/recommendations/${userId}`, {
          params: {
              limit: limit
          }
      });
      return response.data;
  },
  getSimilarCourses: async (courseId: string, limit: number): Promise<{
      success: true,
      data: courseDataGenerale[]
      }> => {
      const response = await axiosInstance.get<{
      success: true,
      data: courseDataGenerale[]
      }>(`/courses/${courseId}/similar`, {
          params: {
              limit: limit
          }
      });
      return response.data;
  }
};

export default ModelService;
