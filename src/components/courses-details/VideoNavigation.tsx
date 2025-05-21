import React from 'react';

interface VideoNavigationProps {
  currentLectureIndex: number;
  totalLectures: number;
  onPreviousVideo: () => void;
  onNextVideo: () => void;
}

const VideoNavigation: React.FC<VideoNavigationProps> = ({
  currentLectureIndex,
  totalLectures,
  onPreviousVideo,
  onNextVideo
}) => {
  return (
    <div className="video-navigation mt-3 mb-4 d-flex justify-content-between">
      <button 
        className="btn btn-outline-primary d-flex align-items-center" 
        onClick={onPreviousVideo}
        disabled={currentLectureIndex <= 0}
      >
        <i className="fas fa-arrow-left me-2"></i>
        Previous Lecture
      </button>
      
      <div className="d-flex align-items-center">
        <span className="mx-3 text-muted">
          {currentLectureIndex + 1} / {totalLectures}
        </span>
      </div>
      
      <button 
        className="btn btn-primary d-flex align-items-center" 
        onClick={onNextVideo}
        disabled={currentLectureIndex >= totalLectures - 1}
      >
        Next Lecture
        <i className="fas fa-arrow-right ms-2"></i>
      </button>
    </div>
  );
};

export default VideoNavigation;