import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
} from "lucide-react";
import "./VideoPlayer.css";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onComplete?: () => void;
  isLocked?: boolean;
  title?: string;
  duration?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  onComplete,
  isLocked = false,
  title = "Video Lesson",
  duration = 0,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  // const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Hide controls after 3 seconds of inactivity
    const hideControls = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setShowControls(true);

      if (isPlaying) {
        timeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    hideControls();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    // Reset video state when src changes
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
    setIsCompleted(false);

    // Load metadata for new video
    if (videoRef.current) {
      const handleLoadedMetadata = () => {
        setVideoDuration(videoRef.current?.duration || 0);
      };

      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        videoRef.current?.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    }
  }, [src]);

  const handlePlayPause = () => {
    if (isLocked) return;

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;

      setCurrentTime(current);
      setProgress((current / duration) * 100);

      // Mark as completed when reaching 90% of the video
      if (current >= duration * 0.9 && !isCompleted) {
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;

    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime =
        (seekTime / 100) * videoRef.current.duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 0.5 : 0);
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={`video-player-container ${isLocked ? "locked" : ""}`}
      ref={playerRef}
      onMouseMove={() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setShowControls(true);
        if (isPlaying) {
          timeoutRef.current = setTimeout(() => {
            setShowControls(false);
          }, 3000);
        }
      }}
    >
      {isLocked && (
        <div className="video-locked-overlay">
          <div className="lock-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h3>Video Locked</h3>
            <p>Complete previous lessons to unlock this content</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="video-element"
        src={
          src
        }
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          if (!isCompleted && onComplete) onComplete();
        }}
        onClick={handlePlayPause}
        playsInline
      />

      <div className={`video-controls ${showControls ? "visible" : ""}`}>
        <div className="video-info">
          <h4>{title}</h4>
          {isCompleted && <span className="completed-badge">Completed</span>}
        </div>

        <input
          title="Progress Bar"
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="h-full bg-blue-500 rounded-full cursor-pointer transition-all"
          disabled={isLocked}
        />

        <div className="controls-bottom">
          <div className="left-controls">
            <button
              className="control-button"
              onClick={handlePlayPause}
              disabled={isLocked}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div className="volume-control">
              <button className="control-button" onClick={toggleMute}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                title="Volume Slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>

            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span> / </span>
              <span>{formatTime(videoDuration || duration)}</span>
            </div>
          </div>

          <div className="right-controls">
            <button
              className="control-button skip-button"
              onClick={() => {
                if (videoRef.current && !isLocked) {
                  videoRef.current.currentTime = Math.min(
                    videoRef.current.currentTime + 10,
                    videoRef.current.duration
                  );
                }
              }}
              disabled={isLocked}
            >
              <SkipForward size={20} />
              <span>10s</span>
            </button>

            <button
              title="Fullscreen"
              className="control-button"
              onClick={toggleFullscreen}
              disabled={isLocked}
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
