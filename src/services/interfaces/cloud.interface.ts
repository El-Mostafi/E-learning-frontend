export interface SignatureData {
  timestamp: number;
  signature: string;
  apiKey: string;
}
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
}