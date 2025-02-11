import axios from "axios";

const API_URL = "http://127.0.0.1:8030";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: Ensures cookies are sent with requests
});

export const authService = {
  signup: async (email: string, password: string, userName: string) => {
    const response = await axios.post(`${API_URL}/signup`, { email, password, userName });
    return response;
  },

  signin: async (email: string, password: string) => {
    const response = await axiosInstance.post("/signin", { email, password });
    localStorage.setItem("token", response.data.jwt); 
    return response;

  },

  signout: async () => {
    localStorage.removeItem("token"); 
  },
  verifyEmail: async (email: string, otp: string) => {
    const response = await axiosInstance.post("/verify-email", { email, otp });
    localStorage.setItem("token", response.data.jwt); 
    return response;

  },

  requestResetPassword: async (email: string) => {
    return axiosInstance.post("/request-reset-password", { email });
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return axiosInstance.post("/reset-password", { email, otp, newPassword });
  },
  resendEmail: async (email: string, userName: string) => {
    return axiosInstance.post("/resendEmail", { email, userName});
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    return axios.get(`${API_URL}/current-user`, {
      headers: { Authorization: `Bearer ${token}` }, // Send JWT with request
    });
  },
};
