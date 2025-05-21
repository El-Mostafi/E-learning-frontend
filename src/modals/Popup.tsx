import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    cloudinary: {
      videoPlayer: (element: HTMLVideoElement | string, options: any) => any;
    };
  }
}

interface CloudinaryVideoModalProps {
  isVideoOpen: boolean;
  setIsVideoOpen: (isOpen: boolean) => void;
  videoId: string;
}

const CloudinaryVideoModal = ({
  isVideoOpen,
  setIsVideoOpen,
  videoId,
}: CloudinaryVideoModalProps) => {
  // State and refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const scriptLoaded = useRef(false);
  const [playerState, setPlayerState] = useState({
    ready: false,
    error: null as string | null,
    fallbackMode: false
  });

  // Reset error state when modal opens
  useEffect(() => {
    if (isVideoOpen) {
      setPlayerState(prev => ({ ...prev, error: null }));
    }
  }, [isVideoOpen]);

  // Handle fallback mode activation
  useEffect(() => {
    if (playerState.error && isVideoOpen) {
      setPlayerState(prev => ({ ...prev, fallbackMode: true }));
    }
  }, [playerState.error, isVideoOpen]);

  // Main player initialization effect
  useEffect(() => {
    // Don't attempt to initialize if modal is closed
    if (!isVideoOpen) return;
    
    let isMounted = true;

    const initializePlayer = async () => {
      try {
        console.log("Initializing Cloudinary player for video:", videoId);
        
        // Load Cloudinary script if not already loaded
        if (!window.cloudinary && !scriptLoaded.current) {
          console.log("Loading Cloudinary script...");
          
          // Load CSS files first
          const cssFiles = [
            'https://unpkg.com/cloudinary-video-player@1.9.0/dist/cld-video-player.min.css',
            'https://unpkg.com/video.js@7.20.3/dist/video-js.min.css'
          ];
          
          for (const href of cssFiles) {
            if (!document.querySelector(`link[href="${href}"]`)) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = href;
              document.head.appendChild(link);
            }
          }
          
          // Then load the script
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/cloudinary-video-player@1.9.0/dist/cld-video-player.min.js';
            script.async = true;
            
            script.onload = () => {
              console.log("Cloudinary script loaded successfully");
              scriptLoaded.current = true;
              resolve();
            };
            
            script.onerror = (e) => {
              console.error("Failed to load Cloudinary script", e);
              reject(new Error("Failed to load Cloudinary video player script"));
            };
            
            document.head.appendChild(script);
          });
        }

        // Wait a moment to ensure everything is properly initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if component is still mounted
        if (!isMounted) return;
        
        // Verify script loaded properly
        if (!window.cloudinary || !window.cloudinary.videoPlayer) {
          throw new Error("Cloudinary video player not available after script load");
        }

        // Check if video element exists
        if (!videoRef.current) {
          throw new Error("Video element reference not found");
        }

        console.log("Creating player instance...");

        // Dispose previous player instance if it exists
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }

        // Log more detailed information about the video we're trying to play
        console.log("Attempting to load video with ID:", videoId);
        
        // Initialize player with simpler configuration - focus on just getting it working
        playerRef.current = window.cloudinary.videoPlayer(videoRef.current, {
          cloud_name: 'dkqkxtwuf',
          controls: true,
          autoplay: true,
          muted: true,
          fluid: true,
          transformation: {
            quality: 'auto',
            fetch_format: 'auto'
          },
          sourceTypes: ['mp4', 'webm'],
          analytics: false
        });
        
        // Set the source with explicit format
        playerRef.current.source(videoId, {
          sourceTypes: ['mp4', 'webm'],
          transformation: {
            width: 'auto',
            dpr: 'auto',
            crop: 'scale'
          }
        });
        
        // Force player to show video element
        playerRef.current.on('loadedmetadata', () => {
          console.log("Video metadata loaded");
          
          // Ensure video is visible
          if (videoRef.current && isMounted) {
            videoRef.current.style.display = 'block';
            videoRef.current.style.visibility = 'visible';
          }
          
          // Try to play after a short delay
          setTimeout(() => {
            if (isMounted && playerRef.current) {
              try {
                playerRef.current.play();
              } catch (e) {
                console.warn("Auto-play failed:", e);
              }
            }
          }, 300);
        });

        // Handle player readiness
        playerRef.current.on('ready', () => {
          console.log("Player ready event fired");
          if (isMounted) {
            setPlayerState(prev => ({ ...prev, ready: true }));
          }
        });

        // Error handling
        playerRef.current.on('error', (error: any) => {
          console.error('Player error:', error);
          if (isMounted) {
            setPlayerState(prev => ({ 
              ...prev, 
              error: `Video playback error: ${error?.message || 'Unknown error'}`
            }));
          }
        });

      } catch (error) {
        console.error('Player initialization failed:', error);
        if (isMounted) {
          setPlayerState(prev => ({ 
            ...prev, 
            error: `Failed to load video player: ${error instanceof Error ? error.message : 'Unknown error'}`
          }));
        }
      }
    };

    initializePlayer();

    // Cleanup function
    return () => {
      isMounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
        } catch (e) {
          console.warn("Error disposing player:", e);
        }
        playerRef.current = null;
      }
      setPlayerState(prev => ({ ...prev, ready: false }));
    };
  }, [isVideoOpen, videoId]);

  // Function to generate direct Cloudinary URL
  const getDirectVideoUrl = (id: string) => {
    return `https://res.cloudinary.com/dkqkxtwuf/video/upload/${id}`;
  };

  // Don't render anything if modal is closed
  if (!isVideoOpen) return null;

  return (
  <div className="fixed inset-0 bg-black bg-opacity-90 z-[1000] flex items-center justify-center p-4">
    <div ref={containerRef} className="relative w-full max-w-6xl bg-black rounded-lg overflow-hidden aspect-video">
      <button
        onClick={() => setIsVideoOpen(false)}
        className="absolute right-4 top-4 z-50 text-white hover:text-gray-300 text-3xl"
        aria-label="Close video player"
      >
        &times;
      </button>
      
      {/* Main player container */}
      <div className="w-full h-full">
        {!playerState.fallbackMode ? (
          <video
            ref={videoRef}
            className="cld-video-player vjs-fluid"
            playsInline
            controls
            data-cld-public-id={videoId}
          >
            <p className="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a
              web browser that <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noreferrer">
              supports HTML5 video</a>
            </p>
          </video>
        ) : (
          <div className="video-fallback">
            <video
              src={getDirectVideoUrl(videoId)}
              controls
              autoPlay
              playsInline
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Loading state */}
      {(!playerState.ready && !playerState.error && !playerState.fallbackMode) && (
        <div className="loading-spinner">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white text-center">Loading player...</p>
        </div>
      )}

      {/* Error state */}
      {playerState.error && !playerState.fallbackMode && (
        <div className="loading-spinner">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2 text-white">Playback Error</h3>
          <p className="text-gray-300 mb-4">{playerState.error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setPlayerState(prev => ({ ...prev, fallbackMode: true }))}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Use Basic Player
            </button>
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default CloudinaryVideoModal;