import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type,
  Palette
} from 'lucide-react';
import { CanvasElement, TextElement, FontOption } from '../../../types/designPanel';

interface TextSectionProps {
  selectedElement: CanvasElement | null;
  onElementUpdate?: (element: CanvasElement) => void;
}

const TextSection: React.FC<TextSectionProps> = ({ 
  selectedElement, 
  onElementUpdate 
}) => {
  const [textColor, setTextColor] = useState('#000000');
  
  const fontOptions: FontOption[] = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Roboto', label: 'Roboto' },
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];

  const isTextElement = selectedElement?.type === 'headline' || selectedElement?.type === 'body';
  const textElement = isTextElement ? selectedElement as TextElement : null;

  const handleFontChange = (fontFamily: string) => {
    if (textElement && onElementUpdate) {
      const updatedElement = { ...textElement, fontFamily };
      onElementUpdate(updatedElement);
    }
  };

  const handleFontSizeChange = (fontSize: number) => {
    if (textElement && onElementUpdate) {
      const updatedElement = { ...textElement, fontSize };
      onElementUpdate(updatedElement);
    }
  };

  const handleFormatToggle = (format: 'bold' | 'italic' | 'underline') => {
    if (textElement && onElementUpdate) {
      const updatedElement = { ...textElement, [format]: !textElement[format] };
      onElementUpdate(updatedElement);
    }
  };

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    if (textElement && onElementUpdate) {
      const updatedElement = { ...textElement, alignment };
      onElementUpdate(updatedElement);
    }
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    if (textElement && onElementUpdate) {
      const updatedElement = { ...textElement, color };
      onElementUpdate(updatedElement);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-white font-medium mb-3">Text</h3>
      
      {isTextElement ? (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <select
              value={textElement?.fontFamily || 'Inter'}
              onChange={(e) => handleFontChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
            
            <select
              value={textElement?.fontSize || 16}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              className="w-20 px-2 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-1">
            <button
              onClick={() => handleFormatToggle('bold')}
              className={`p-2 rounded transition-colors ${
                textElement?.bold 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            
            <button
              onClick={() => handleFormatToggle('italic')}
              className={`p-2 rounded transition-colors ${
                textElement?.italic 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            
            <button
              onClick={() => handleFormatToggle('underline')}
              className={`p-2 rounded transition-colors ${
                textElement?.underline 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              title="Underline"
            >
              <Underline size={16} />
            </button>

            <div className="flex items-center space-x-1">
              <button
                className="p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                title="Text Color"
              >
                <Palette size={16} className="text-white" />
              </button>
              <div 
                className="w-6 h-6 rounded border border-gray-500 cursor-pointer"
                style={{ backgroundColor: textElement?.color || '#000000' }}
                onClick={() => document.getElementById('text-color-input')?.click()}
              />
              <input
                id="text-color-input"
                type="color"
                value={textElement?.color || '#000000'}
                onChange={(e) => handleColorChange(e.target.value)}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex space-x-1">
            <button
              onClick={() => handleAlignmentChange('left')}
              className={`flex-1 p-2 rounded transition-colors ${
                textElement?.alignment === 'left' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            
            <button
              onClick={() => handleAlignmentChange('center')}
              className={`flex-1 p-2 rounded transition-colors ${
                textElement?.alignment === 'center' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            
            <button
              onClick={() => handleAlignmentChange('right')}
              className={`flex-1 p-2 rounded transition-colors ${
                textElement?.alignment === 'right' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>

          <div className="flex space-x-1">
            <button
              className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-white text-sm"
              title="Add Shadow"
            >
              S
            </button>
            
            <button
              className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-white text-sm"
              title="Add Outline"
            >
              O
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-sm text-center py-4">
          Select a text element to edit formatting
        </div>
      )}
    </div>
  );
};

export default TextSection;
