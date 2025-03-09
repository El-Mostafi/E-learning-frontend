import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCourse } from '../context/CourseContext';
import Button from './common/Button';
import { Upload, X, Film, AlertCircle } from 'lucide-react';

const VideoUpload: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ 
  onContinue, 
  onBack 
}) => {
  const { state, dispatch } = useCourse();
  const { videos } = state;
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateAspectRatio = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const aspectRatio = video.videoWidth / video.videoHeight;
        // Check if aspect ratio is close to 16:9 (with some tolerance)
        const isValid = Math.abs(aspectRatio - 16/9) < 0.1;
        resolve(isValid);
      };
      
      video.onerror = () => {
        resolve(false);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };
  
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        resolve(0);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };
  
  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      setErrors({
        ...errors,
        dropzone: fileRejections[0].errors[0].message,
      });
      return;
    }
    
    setErrors({});
    
    for (const file of acceptedFiles) {
      const isValidRatio = await validateAspectRatio(file);
      const duration = await getVideoDuration(file);
      
      const videoId = `video-${Date.now()}-${videos.length}`;
      
      if (!isValidRatio) {
        dispatch({
          type: 'ADD_VIDEO',
          payload: {
            id: videoId,
            file,
            progress: 0,
            preview: URL.createObjectURL(file),
            error: 'Video aspect ratio should be 16:9',
            duration,
          },
        });
        continue;
      }
      
      // Simulate upload progress
      dispatch({
        type: 'ADD_VIDEO',
        payload: {
          id: videoId,
          file,
          progress: 0,
          preview: URL.createObjectURL(file),
          duration,
        },
      });
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        
        dispatch({
          type: 'UPDATE_VIDEO',
          payload: {
            id: videoId,
            updates: { progress },
          },
        });
      }, 500);
    }
  }, [videos, dispatch, errors]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/mp4': [],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop,
  });
  
  const removeVideo = (id: string) => {
    dispatch({
      type: 'REMOVE_VIDEO',
      payload: id,
    });
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDuration = (seconds: number): string => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const validateVideos = () => {
    if (videos.length === 0) {
      setErrors({ general: 'You need to upload at least one video' });
      return false;
    }
    
    const hasErrors = videos.some(video => video.error);
    if (hasErrors) {
      setErrors({ general: 'Please fix the errors in your uploaded videos' });
      return false;
    }
    
    const allUploaded = videos.every(video => video.progress === 100);
    if (!allUploaded) {
      setErrors({ general: 'Please wait for all videos to finish uploading' });
      return false;
    }
    
    setErrors({});
    return true;
  };
  
  const handleContinue = () => {
    if (validateVideos()) {
      onContinue();
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Course Videos</h2>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-6
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${errors.dropzone ? 'border-red-500 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-600 mb-1">Drag & drop video files here, or click to select</p>
          <p className="text-xs text-gray-500">MP4 format only (max 100MB each)</p>
          <p className="text-xs text-gray-500 mt-1">Videos should have a 16:9 aspect ratio</p>
        </div>
      </div>
      
      {errors.dropzone && (
        <p className="mt-1 mb-4 text-sm text-red-600">{errors.dropzone}</p>
      )}
      
      {videos.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Uploaded Videos ({videos.length})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div 
                key={video.id} 
                className={`border rounded-lg overflow-hidden ${video.error ? 'border-red-300' : 'border-gray-200'}`}
              >
                <div className="aspect-video bg-gray-100 relative">
                  <video 
                    src={video.preview} 
                    className="w-full h-full object-cover"
                    controls={video.progress === 100}
                  ></video>
                  
                  {video.progress < 100 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="font-medium">{Math.round(video.progress)}%</p>
                        <p className="text-xs">Uploading...</p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removeVideo(video.id)}
                    className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90"
                    aria-label="Remove video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate" title={video.file.name}>
                        {video.file.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Film className="w-3 h-3 mr-1" />
                        <span>{formatFileSize(video.file.size)}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDuration(video.duration || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {video.error && (
                    <div className="mt-2 flex items-start text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
                      <span>{video.error}</span>
                    </div>
                  )}
                  
                  {video.progress < 100 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${video.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          onClick={onBack} 
          variant="outline"
        >
          Back
        </Button>
        <Button onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default VideoUpload;