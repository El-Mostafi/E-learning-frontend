import React from 'react';
import { CourseProvider, useCourse } from './context/CourseContext';
import CourseDetailsForm from './components/CourseDetailsForm';
import SectionBuilder from './components/SectionBuilder';
import VideoUpload from './components/VideoUpload';
import QuizBuilder from './components/QuizBuilder';
import CoursePreview from './components/CoursePreview';
import ProgressBar from './components/common/ProgressBar';
import ErrorBoundary from './components/common/ErrorBoundary';
import { GraduationCap as Graduation } from 'lucide-react';

const CourseCreator: React.FC = () => {
  const { state, dispatch } = useCourse();
  const { currentStep } = state;
  
  const handleContinue = () => {
    dispatch({
      type: 'SET_CURRENT_STEP',
      payload: currentStep + 1,
    });
  };
  
  const handleBack = () => {
    dispatch({
      type: 'SET_CURRENT_STEP',
      payload: currentStep - 1,
    });
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CourseDetailsForm onContinue={handleContinue} />;
      case 1:
        return <SectionBuilder onContinue={handleContinue} onBack={handleBack} />;
      case 2:
        return <VideoUpload onContinue={handleContinue} onBack={handleBack} />;
      case 3:
        return <QuizBuilder onContinue={handleContinue} onBack={handleBack} />;
      case 4:
        return <CoursePreview onBack={handleBack} />;
      default:
        return <CourseDetailsForm onContinue={handleContinue} />;
    }
  };
  
  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-full mr-3">
            <Graduation className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Course Creator</h1>
        </div>
        
        <ProgressBar currentStep={currentStep} totalSteps={5} />
      </div>
      
      <ErrorBoundary>
        {renderStep()}
      </ErrorBoundary>
    </div>
  );
};

function CreateCours() {
  return (
    <CourseProvider>
      <CourseCreator />
    </CourseProvider>
  );
}

export default CreateCours;