import axiosInstance from "./api";

export interface IFormData {
  name: string;
  number: string;
  email: string;
  subject: string;
  message: string;
}

const ContactService = {
  sendMessage: async (formData: IFormData): Promise<void> => {
    await axiosInstance.post("/contact", formData);
  },
};

export default ContactService;
