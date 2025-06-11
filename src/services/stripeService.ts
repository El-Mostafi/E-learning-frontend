import axiosInstance from "./api";
import { RevenueStats } from "./interfaces/stripe.interface";


export const stripeService = {
  createPaymentIntent: async () => {
    return await axiosInstance.post<{ clientSecret: string }>(
      "/payment-intent"
    );
  },
  getRevenueStats: async (): Promise<RevenueStats> => {
    const response = await axiosInstance.get<RevenueStats>("/admin/revenue-stats");
    return response.data;
  },
};
