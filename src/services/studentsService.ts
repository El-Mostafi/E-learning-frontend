import axiosInstance from './api';
import { StudentStats } from './interfaces/student.interface';



const StudentService = {
  
  
  getDashboardStats: async (): Promise<StudentStats> => {
      const response = await axiosInstance.get<StudentStats>('/students/dashboard');
      return response.data; 
  }
};

export default StudentService;
