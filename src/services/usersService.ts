import { CreateUserDto } from "../components/profile/Profile Form/types";
import axiosInstance from "./api";
export interface User {
  id: string;
  userName: string;
  profileImg: string;
  email: string;
  role: UserRole;
  status: "active" | "blocked";
  emailConfirmed: boolean;
  createdAt: Date;
  lastLogin: Date | null;
  coursesEnrolled?: number;
  coursesCreated?: number;
}
export interface UserToEdit {
  id: string;
  userName: string;
  profileImg: string;
  publicId: string,
  email: string;
  role: UserRole;
  status: "active" | "blocked";
  // Student fields
  educationLevel?: string;
  fieldOfStudy?: string;
  // Instructor fields
  expertise?: string;
  yearsOfExperience?: number;
  biography?: string;
}
export type UserRole = "admin" | "instructor" | "student";
interface options {
  page: number;
  limit: number;
  role: string | undefined;
  status: string | undefined;
  search: string | undefined;
}
export interface UsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}


const usersService = {
  getAllUsers: async (options: options): Promise<UsersResponse> => {
    const response = await axiosInstance.get<UsersResponse>("/users", {
      params: {
        page: options.page,
        limit: options.limit,
        role: options.role,
        status: options.status,
        search: options.search,
      },
    });
    return response.data;
  },
  getUserById: async (id: string): Promise<UserToEdit> => {
    const response = await axiosInstance.get<UserToEdit>(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id: string, payload: UserToEdit): Promise<User> => {
    const response = await axiosInstance.put<User>(`/users/${id}`, payload);
    return response.data;
  },
  deleteUserById: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
  createUser: async (userData: CreateUserDto): Promise<User> => {
    const response = await axiosInstance.post<User>(`/users`, userData);
    return response.data;
  },
  updateUserStatus: async (userId: string, status: string) => {
    const response = await axiosInstance.patch<User>(`/users/${userId}/status`, { status });
    return response.data;
  },
  
};

export default usersService;
