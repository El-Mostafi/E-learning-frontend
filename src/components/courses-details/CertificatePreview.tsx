// src/components/CertificatePreview.tsx (or wherever it is located)

import React, { useState, useEffect } from "react";
import { X, Download, Award, Loader, AlertCircle } from "lucide-react";
// NEW: Import the service function and its type
import { coursService, CertificateData } from "../../services/coursService";

interface CertificatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

// Helper components (LoadingSpinner, ErrorDisplay) remain the same...
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center text-gray-500">
    <Loader className="w-12 h-12 animate-spin text-purple-600" />
    <p className="mt-4 text-lg font-medium">Loading Certificate Preview...</p>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center text-red-600 bg-red-50 p-6 rounded-lg">
    <AlertCircle className="w-12 h-12" />
    <p className="mt-4 text-lg font-medium">Oops! Something went wrong.</p>
    <p className="text-sm text-center">{message}</p>
  </div>
);

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // NEW: State to hold the fetched certificate data (blob and filename)
  const [certificateData, setCertificateData] =
    useState<CertificateData | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;

    const loadCertificate = async () => {
      setIsLoadingPreview(true);
      setPreviewError(null);
      setPdfUrl(null);
      setCertificateData(null);

      try {
        // CHANGED: Use the new service function
        const data = await coursService.fetchCertificatePdf(
          courseId,
          courseTitle
        );

        if (isMounted) {
          setCertificateData(data);
          const url = window.URL.createObjectURL(data.blob);
          setPdfUrl(`${url}#view=FitV`);
        }
      } catch (error) {
        if (isMounted) {
          setPreviewError(
            "Failed to load certificate preview. You can still try to download it."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingPreview(false);
        }
      }
    };

    loadCertificate();

    return () => {
      isMounted = false;
      if (pdfUrl) {
        const originalUrl = pdfUrl.split("#")[0];
        window.URL.revokeObjectURL(originalUrl);
      }
    };
  }, [isOpen, courseId, courseTitle]);

  // CHANGED: This function is now much simpler and more efficient.
  const handleDownload = () => {
    // Abort if data isn't loaded yet
    if (!pdfUrl || !certificateData) {
      alert(
        "Certificate data is not available yet. Please wait for the preview to load."
      );
      return;
    }

    setIsDownloading(true);

    try {
      const a = document.createElement("a");
      // Use the already created URL from the preview
      a.href = pdfUrl.split("#")[0];
      // Use the filename we got from the service
      a.download = certificateData.filename;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error during download process:", error);
      alert("Failed to initiate download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  // The JSX for rendering the modal remains exactly the same
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl h-[96vh] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Certificate Preview
              </h2>
              <p className="text-purple-100 text-sm md:text-base truncate">
                {courseTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Real PDF Preview Area */}
        <div className="flex-grow p-2 bg-gray-200 flex items-center justify-center overflow-auto">
          {isLoadingPreview && <LoadingSpinner />}
          {previewError && !isLoadingPreview && (
            <ErrorDisplay message={previewError} />
          )}
          {pdfUrl && !previewError && (
            <iframe
              src={pdfUrl}
              title={`Certificate for ${courseTitle}`}
              className="w-full h-full border-none"
              aria-label="Certificate PDF Preview"
            />
          )}
        </div>

        {/* Footer with download button */}
        <div className="flex-shrink-0 p-4 md:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 hidden sm:block">
              <p>🎉 Congratulations on your achievement!</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm md:text-base"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                // Disable if downloading or if data is not ready
                disabled={isDownloading || !certificateData}
                className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isDownloading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
