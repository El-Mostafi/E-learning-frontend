// interfaces/user.interface.ts
export interface BaseUser {
    _id: string;
    email: string;
    userName: string;
    role: 'student' | 'instructor';
    profileImg?: string;
    coverImg?: string;
    aboutMe?: string;
  }
  
  export interface Instructor extends BaseUser {
    expertise: string;
    yearsOfExperience: number;
    biography: string;
  }
  
  export interface Student extends BaseUser {
    educationLevel: string;
    fieldOfStudy: string;
  }