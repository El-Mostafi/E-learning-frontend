import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  onStepClick?: (step: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  labels = ['Course Details', 'Sections', 'Videos', 'Quiz', 'Publish'],
  onStepClick
}) => {
  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => onStepClick?.(index)}
            style={{ cursor: onStepClick ? 'pointer' : 'default' }}
          >
            <div 
              className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium mb-1
                ${index < currentStep ? 'bg-blue-600 text-white' : 
                  index === currentStep ? 'border-2 border-blue-600 text-blue-600' : 
                  'border-2 border-gray-300 text-gray-400'}`}
            >
              {index < currentStep ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-center hidden xs:block">{labels[index]}</span>
          </div>
        ))}
      </div>
      
      <div className="relative w-full h-1.5 sm:h-2 bg-gray-200 rounded-full">
        <div 
          className="absolute top-0 left-0 h-1.5 sm:h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;