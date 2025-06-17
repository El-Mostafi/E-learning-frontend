import axiosInstance from "./api";
import axios from "axios";
import { CloudinaryUploadResponse, SignatureData } from "./interfaces/cloud.interface";
// import { VideoFile } from "../components/profile/Create Cours/types/index";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;

export const cloudService = {
  getSignatureImage: async () => {
    return axiosInstance.get<SignatureData>("/get-signature/image");
  },
  getSignatureVideo: async () => {
    return axiosInstance.get<SignatureData>("/get-signature/video");
  },
  uploadFile: async (
    croppedImage: File,
    signature: SignatureData,
    UPLOAD_PRESET: string
  ) => {
    if (!signature) throw new Error("Signature is missing");

    const formData = new FormData();
    formData.append("file", croppedImage);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", signature.timestamp.toString());
    formData.append("signature", signature.signature);
    formData.append("upload_preset", UPLOAD_PRESET);

    return await axios.post<CloudinaryUploadResponse>(CLOUDINARY_URL, formData);
  },
  uploadVideoToCloudinary: async (
    signature: SignatureData,
    videoFile: File,
    sectionId: string,
    updateProgress: (id: string, sectionId: string, progress: number) => void,
    videoId: string
  ) => {
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", signature.timestamp.toString());
    formData.append("signature", signature.signature);
    formData.append("upload_preset", "videos_preset");
    formData.append("tags", "temporary,draft");

    try {
      const response = await axios.post<CloudinaryUploadResponse>(
        CLOUDINARY_URL,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            updateProgress(videoId, sectionId, progress);
          },
        }
      );

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error("Upload failed :" + errorMessage);
    }
  },
  deleteFile: async (publicId: string, type: string, courseId: string) => {
    const response = await axiosInstance.delete(
      `/delete/${type}/${publicId}`,
      { params: { courseId } }
    );
    return response;
  },
};
