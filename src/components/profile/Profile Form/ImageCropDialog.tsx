import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { X } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropDialogProps {
  imageUrl: string;
  imageName: string;
  onClose: () => void;
  onSave: (croppedImageUrl: File,previewUrl: string) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropDialog({ imageUrl,imageName, onClose, onSave }: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  const handleSave = () => {
    if (!completedCrop || !imgRef.current) return;
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
  
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
  
    ctx.setTransform(
      scale * scaleX,
      0,
      0,
      scale * scaleY,
      -(completedCrop.x * scale * scaleX),
      -(completedCrop.y * scale * scaleY),
    );
  
    if (rotate) {
      ctx.translate(imgRef.current.width / 2, imgRef.current.height / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.translate(-imgRef.current.width / 2, -imgRef.current.height / 2);
    }
  
    ctx.drawImage(
      imgRef.current,
      0,
      0,
      imgRef.current.width,
      imgRef.current.height,
    );
    const previewUrl = canvas.toDataURL("image/jpeg");
    // Convert canvas to Blob/File instead of base64
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      // Create a File object from the Blob
      const file = new File([blob], `${imageName}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
  
      // Pass the File object to your save handler
      onSave(file,previewUrl);
    }, 'image/jpeg', 0.9); // 0.9 = JPEG quality
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-h-[90vh] max-w-3xl w-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile Picture</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label='Close'
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="max-w-2xl w-full bg-gray-50 rounded-lg overflow-hidden">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
            >
              <img
                ref={imgRef}
                alt="Profile"
                src={imageUrl}
                onLoad={onImageLoad}
                className="max-w-full h-auto"
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                }}
              />
            </ReactCrop>
          </div>

          <div className="w-full max-w-md space-y-4">
            <div>
              <label htmlFor='zoom' className="block text-sm font-medium text-gray-700 mb-1">
                Zoom
              </label>
              <input
                id='zoom'
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full bg-blue-600"
              />
            </div>

            <div>
              <label htmlFor='rotate' className="block text-sm font-medium text-gray-700 mb-1">
                Rotate
              </label>
              <input
                id="rotate"
                type="range"
                min="0"
                max="360"
                value={rotate}
                onChange={(e) => setRotate(Number(e.target.value))}
                className="w-full bg-blue-600"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}