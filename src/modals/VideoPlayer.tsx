import { useEffect, useRef, useState } from "react";

declare global {
  namespace cloudinary {
    function videoPlayer(element: HTMLElement | string, options: any): any;
  }
}

interface CloudinaryVideoModalProps {
  videoId: string;
  onClose: () => void;
}

const CloudinaryVideoModal = ({
  videoId,
  onClose,
}: CloudinaryVideoModalProps) => {
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Cloudinary Video Player script
    const loadScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/cloudinary-video-player/dist/cld-video-player.min.js";
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    };

    if (!document.querySelector('script[src*="cloudinary-video-player"]')) {
      loadScript();
    } else {
      setScriptLoaded(true);
    }

    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && videoPlayerRef.current) {
      // Initialize video player
      playerInstance.current = cloudinary.videoPlayer(videoPlayerRef.current, {
        cloud_name: "dkqkxtwuf",
        controls: true,
        muted: false,
        fluid: true,
        transformation: { quality: "auto" },
        sourceTypes: ["mp4", "webm"],
        sources: [
          {
            publicId: videoId,
            type: "video",
          },
        ],
      });

      // Optional: Add event listeners
      playerInstance.current.on("play", () => {
        console.log("Video playback started");
      });
    }
  }, [scriptLoaded, videoId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl mx-4">
        <div className="bg-black rounded-lg overflow-hidden">
          <button
            onClick={onClose}
            className="absolute -top-8 -right-8 text-white hover:text-gray-300 text-4xl z-50"
            aria-label="Close video"
          >
            &times;
          </button>
          <div
            ref={videoPlayerRef}
            className="cld-video-player cld-fluid"
            data-cld-public-id={videoId}
          />
        </div>
      </div>
    </div>
  );
};

export default CloudinaryVideoModal;
