export type UserRole = "admin" | "instructor" | "student";



export interface CreateUserDto {
  email: string;
  password: string;
  userName: string;
  role: UserRole;
  aboutMe?: string;
  // Student fields
  educationLevel?: string;
  fieldOfStudy?: string;
  // Instructor fields
  expertise?: string;
  yearsOfExperience?: number;
  biography?: string;
}

export interface FilterOptions {
  status?: string;
  role?: string;
  category?: string;
  dateRange?: string;
}