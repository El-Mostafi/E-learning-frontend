import axiosInstance from "./api";
import { DashboardData, DashboardStats } from "./interfaces/admin.interface";

const adminService = {
  
  getDashboardAnalytics: async (): Promise<DashboardData> => {
    const response = await axiosInstance.get<DashboardData>("/admin/analytics");
    return response.data;
  },
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>("/admin/stats");
    return response.data;
  },
};

export default adminService;
