import React, { useState } from 'react';
import { Palette, Link } from 'lucide-react';
import { SectionProps, BackgroundElement } from '../../../types/designPanel';

const BackgroundSection: React.FC<SectionProps> = ({ onElementAdd }) => {
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const predefinedColors = [
    '#ffffff', '#000000', '#f3f4f6', '#374151',
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const backgroundElement: BackgroundElement = {
      id: `background-${Date.now()}`,
      type: 'background',
      color: color,
    };
    onElementAdd(backgroundElement);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const backgroundElement: BackgroundElement = {
        id: `background-${Date.now()}`,
        type: 'background',
        imageUrl: urlInput.trim(),
      };
      onElementAdd(backgroundElement);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleFromUrlClick = () => {
    setShowUrlInput(!showUrlInput);
  };

  return (
    <div className="mb-6">
      <h3 className="text-white font-medium mb-3">Background</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleColorChange(selectedColor)}
            className="w-8 h-8 rounded border-2 border-gray-500 flex items-center justify-center"
            style={{ backgroundColor: selectedColor }}
          >
            <Palette size={16} className="text-gray-600" />
          </button>
          
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 rounded border border-gray-500 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-6 gap-1">
          {predefinedColors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className="w-6 h-6 rounded border border-gray-500 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <button
          onClick={handleFromUrlClick}
          className="w-full bg-transparent border border-gray-500 text-white py-2 px-4 rounded text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Link size={16} />
          <span>From URL</span>
        </button>

        {showUrlInput && (
          <div className="space-y-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter background image URL..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
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
    </div>
  );
};

export default BackgroundSection;
