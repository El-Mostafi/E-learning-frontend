import axiosInstance from './api';
import { DashboardStats, InstructorSummary } from './interfaces/instructor.interface';
import { Instructor } from './interfaces/user.interface';



const InstructorService = {
  
  getAllInstructors: async (): Promise<Instructor[]> => {
      const response = await axiosInstance.get<Instructor[]>('/instructors');
      return response.data; 
  },

  getInstructorById: async (id: string): Promise<Instructor> => {
      const response = await axiosInstance.get<Instructor>(`/instructors/${id}`);
      return response.data; 
  },
  getDashboardStats: async (): Promise<DashboardStats> => {
      const response = await axiosInstance.get<DashboardStats>('/instructors/dashboard');
      return response.data; 
  },

  getInstructorStats: async (instructorId: string): Promise<InstructorSummary> => {
      const response = await axiosInstance.get<InstructorSummary>(`/instructors/stats`, {
          params: { instructorId }
      });
      return response.data; 
  },

  getTopInstructors: async (): Promise<Instructor[]> => {
      const response = await axiosInstance.get<Instructor[]>("/top-instructors");
      return response.data; 
  }
};

export default InstructorService;
