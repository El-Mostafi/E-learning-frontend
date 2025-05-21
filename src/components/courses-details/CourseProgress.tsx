import React from 'react';

interface CourseProgressProps {
  completedLectures: number;
  totalLectures: number;
}

const CourseProgress: React.FC<CourseProgressProps> = ({ completedLectures, totalLectures }) => {
  const progressPercentage = totalLectures > 0 
    ? Math.round((completedLectures / totalLectures) * 100) 
    : 0;
  
  return (
    <div className="course-progress mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="m-0">Course Progress</h5>
        <span className="progress-percentage">{progressPercentage}%</span>
      </div>
      
      <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
        <div 
          className="progress-bar progress-bar-striped progress-bar-animated" 
          role="progressbar"
          style={{ 
            width: `${progressPercentage}%`,
            background: 'linear-gradient(to right, #4481eb, #04befe)',
            borderRadius: '5px'
          }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      
      <div className="d-flex justify-content-between mt-2 text-muted">
        <small>Completed: {completedLectures} lectures</small>
        <small>Total: {totalLectures} lectures</small>
      </div>
    </div>
  );
};

export default CourseProgress;