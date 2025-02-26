import axiosInstance from "./api";
import axios from "axios";

interface SignatureData {
  timestamp: number;
  signature: string;
  apiKey: string;
}
interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
}
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;


export const cloudService = {
  getSignature: async () => {
    return axiosInstance.get<SignatureData>("/api/get-signature");
  },
  uploadFile: async (croppedImage: File, signature: SignatureData, UPLOAD_PRESET: string) => {
    if (!signature) throw new Error("Signature is missing");

    const formData = new FormData();
    formData.append("file", croppedImage);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", signature.timestamp.toString());
    formData.append("signature", signature.signature);
    formData.append("upload_preset", UPLOAD_PRESET);

    return await axios.post<CloudinaryUploadResponse>(CLOUDINARY_URL , formData);
    
  },
};
