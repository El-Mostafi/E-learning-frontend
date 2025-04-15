import axiosInstance from './api';
import { Instructor } from './interfaces/user.interface';

const InstructorService = {
  
  getAllInstructors: async (): Promise<Instructor[]> => {
      const response = await axiosInstance.get<Instructor[]>('/instructors');
      return response.data; 
  },

  getInstructorById: async (id: string): Promise<Instructor> => {
      const response = await axiosInstance.get<Instructor>(`/instructors/${id}`);
      return response.data; 
  }
};

export default InstructorService;
