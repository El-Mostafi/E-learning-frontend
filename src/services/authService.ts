// services/authService.ts
import axiosInstance from "./api";

export const authService = {
  signup: async (email: string, password: string, userName: string) => {
    return axiosInstance.post("/signup", { email, password, userName });
  },

  signin: async (email: string, password: string, RememberMe: boolean) => {
    const response = await axiosInstance.post("/signin", {
      email,
      password,
      RememberMe,
    });
    localStorage.setItem("token", response.data.jwt);
    return response;
  },

  signout: async () => {
    if (!localStorage.getItem("token")) return;
    const response = await axiosInstance.post("/signout");
    localStorage.removeItem("token");
    return response;
  },

  verifyEmail: async (email: string) => {
    return axiosInstance.post("/verify-email", { email });
  },

  verifyOtp: async (email: string, otp: string) => {
    return axiosInstance.post("/verify-Otp", { email, otp });
  },

  requestResetPassword: async (email: string) => {
    return axiosInstance.post("/request-reset-password", { email });
  },

  resetPassword: async (email: string, newPassword: string) => {
    return axiosInstance.put("/reset-password", { email, newPassword });
  },

  resendEmail: async (email: string, Source: string) => {
    return axiosInstance.post("/resendEmail", { email, Source });
  },

  getCurrentUser: async () => {
    return axiosInstance.get("/current-user");
  },

  updateUser: async (userName: string, profileImg: string) => {
    const response = await axiosInstance.put("/update-user", { userName, profileImg });
    localStorage.setItem("token", response.data.jwt);
    return response;
  },
};
