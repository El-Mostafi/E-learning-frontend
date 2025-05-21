import axiosInstance from "./api";
import { cartDetails } from "./interfaces/cart.interface";

export const cartService = {
  getCart: async () => {
    const response = await axiosInstance.get<cartDetails>("/cart");
    return response.data;
  },

  async clearCart() {
    const response = await axiosInstance.delete<string>("/cart/clear");
    return response.data;
  },

  
};