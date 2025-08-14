import React, { useRef, useState } from 'react';
import { Upload, Link } from 'lucide-react';
import { SectionProps, ImageElement } from '../../../types/designPanel';

const ImagesSection: React.FC<SectionProps> = ({ onElementAdd }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageElement: ImageElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          src: e.target?.result as string,
          x: 150,
          y: 150,
          width: 200,
          height: 150,
          rotation: 0,
          zIndex: 1,
          locked: false,
          visible: true,
        };
        onElementAdd(imageElement);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const imageElement: ImageElement = {
        id: `image-${Date.now()}`,
        type: 'image',
        src: urlInput.trim(),
        x: 150,
        y: 150,
        width: 200,
        height: 150,
        rotation: 0,
        zIndex: 1,
        locked: false,
        visible: true,
      };
      onElementAdd(imageElement);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleFromUrlClick = () => {
    setShowUrlInput(!showUrlInput);
  };

  return (
    <div className="mb-6">
      <h3 className="text-white font-medium mb-3">Images</h3>
      
      <div className="space-y-2">
        <button
          onClick={handleUploadClick}
          className="w-full bg-white text-gray-800 py-2 px-4 rounded text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
        >
          <Upload size={16} />
          <span>Upload</span>
        </button>

        <button
          onClick={handleFromUrlClick}
          className="w-full bg-transparent border border-gray-500 text-white py-2 px-4 rounded text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Link size={16} />
          <span>From URL</span>
        </button>

        {showUrlInput && (
          <div className="mt-2 space-y-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput('');
                }}
                className="flex-1 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ImagesSection;
