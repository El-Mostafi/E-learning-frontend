import React, { useState } from 'react';
import { useCourse } from '../context/CourseContext';
import Button from './common/Button';
import { CheckCircle, AlertCircle, Edit, Book, Video, HelpCircle, DollarSign, Eye, EyeOff } from 'lucide-react';

const CoursePreview: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, dispatch } = useCourse();
  const { courseDetails, sections, videos, quizQuestions, pricing, visibility } = state;
  
  const [errors, setErrors] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const validateCourse = () => {
    const newErrors: string[] = [];
    
    if (!courseDetails.title || !courseDetails.thumbnail || !courseDetails.category || 
        !courseDetails.level || !courseDetails.description) {
      newErrors.push('Course details are incomplete');
    }
    
    if (sections.length === 0) {
      newErrors.push('Your course needs at least one section');
    }
    
    if (videos.length === 0) {
      newErrors.push('Your course needs at least one video');
    }
    
    if (quizQuestions.length === 0) {
      newErrors.push('Your course needs at least one quiz question');
    }
    
    if (!pricing.isFree && (!pricing.price || pricing.price <= 0)) {
      newErrors.push('Please set a valid price for your course');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };
  
  const handlePublish = () => {
    if (validateCourse()) {
      setShowConfirmation(true);
    }
  };
  
  const confirmPublish = () => {
    dispatch({ type: 'PUBLISH_COURSE' });
    // Here you would typically send the course data to your backend
    alert('Course published successfully!');
  };
  
  const handlePricingChange = (isFree: boolean) => {
    dispatch({
      type: 'SET_PRICING',
      payload: { isFree },
    });
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value);
    if (!isNaN(price)) {
      dispatch({
        type: 'SET_PRICING',
        payload: { price },
      });
    }
  };
  
  const handleVisibilityChange = (value: 'public' | 'private' | 'unlisted') => {
    dispatch({
      type: 'SET_VISIBILITY',
      payload: value,
    });
  };
  
  const goToStep = (step: number) => {
    dispatch({
      type: 'SET_CURRENT_STEP',
      payload: step,
    });
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Course Preview & Publish</h2>
      
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-700 font-medium mb-2 flex items-center">
            <AlertCircle className="w-5 h-5 mr-1" />
            Please fix the following issues before publishing:
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Course Summary</h3>
          <button
            type="button"
            onClick={() => goToStep(0)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Details
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg overflow-hidden border">
          <div className="md:flex">
            <div className="md:w-1/3">
              {courseDetails.thumbnailPreview ? (
                <img 
                  src={courseDetails.thumbnailPreview} 
                  alt="Course thumbnail" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-200 w-full h-full min-h-[160px] flex items-center justify-center">
                  <span className="text-gray-400">No thumbnail</span>
                </div>
              )}
            </div>
            <div className="p-4 md:w-2/3">
              <h4 className="font-bold text-xl mb-2">{courseDetails.title || 'Untitled Course'}</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {courseDetails.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {courseDetails.category}
                  </span>
                )}
                {courseDetails.level && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {courseDetails.level}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: courseDetails.description }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center text-blue-700 mb-2">
            <Book className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Sections</h3>
          </div>
          <p className="text-2xl font-bold">{sections.length}</p>
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-center text-purple-700 mb-2">
            <Video className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Videos</h3>
          </div>
          <p className="text-2xl font-bold">{videos.length}</p>
          <button
            type="button"
            onClick={() => goToStep(2)}
            className="mt-2 text-purple-600 hover:text-purple-800 text-sm flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <div className="flex items-center text-amber-700 mb-2">
            <HelpCircle className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Quiz Questions</h3>
          </div>
          <p className="text-2xl font-bold">{quizQuestions.length}</p>
          <button
            type="button"
            onClick={() => goToStep(3)}
            className="mt-2 text-amber-600 hover:text-amber-800 text-sm flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Course Settings</h3>
        
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b">
              <h4 className="font-medium flex items-center">
                <DollarSign className="w-5 h-5 mr-1 text-gray-600" />
                Pricing
              </h4>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pricing"
                    checked={pricing.isFree}
                    onChange={() => handlePricingChange(true)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2">Free</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pricing"
                    checked={!pricing.isFree}
                    onChange={() => handlePricingChange(false)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2">Paid</span>
                </label>
              </div>
              
              {!pricing.isFree && (
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">$</span>
                  <input
                    type="number"
                    min="0.99"
                    step="0.01"
                    value={pricing.price || ''}
                    onChange={handlePriceChange}
                    className="w-24 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Price"
                  />
                  <span className="text-gray-500 ml-2">USD</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b">
              <h4 className="font-medium flex items-center">
                <Eye className="w-5 h-5 mr-1 text-gray-600" />
                Visibility
              </h4>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={() => handleVisibilityChange('public')}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-2">
                    <span className="font-medium block">Public</span>
                    <span className="text-sm text-gray-500">Anyone can find and access your course</span>
                  </div>
                </label>
                
                <label className="flex items-start">
                  <input
                    type="radio"
                    name="visibility"
                    value="unlisted"
                    checked={visibility === 'unlisted'}
                    onChange={() => handleVisibilityChange('unlisted')}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-2">
                    <span className="font-medium block">Unlisted</span>
                    <span className="text-sm text-gray-500">Only people with the link can access your course</span>
                  </div>
                </label>
                
                <label className="flex items-start">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={() => handleVisibilityChange('private')}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-2">
                    <span className="font-medium block">Private</span>
                    <span className="text-sm text-gray-500">Only you can access your course</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          onClick={onBack} 
          variant="outline"
        >
          Back
        </Button>
        <Button onClick={handlePublish}>
          Publish Course
        </Button>
      </div>
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Publication</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to publish this course? Once published, it will be available according to your visibility settings.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmPublish}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirm Publish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePreview;