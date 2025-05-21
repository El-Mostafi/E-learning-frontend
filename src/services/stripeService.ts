import axiosInstance from "./api";


export const stripeService = {
  createPaymentIntent: async () => {

    return await axiosInstance.post<{ clientSecret: string }>("/payment-intent");
    
  },
};
