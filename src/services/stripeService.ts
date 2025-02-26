import axiosInstance from "./api";



export const stripeService = {
  createPaymentIntent: async (amount: number, currency: string) => {

    return await axiosInstance.post<{ clientSecret: string }>("/api/payment-intent", { amount, currency });
    
  },
};
