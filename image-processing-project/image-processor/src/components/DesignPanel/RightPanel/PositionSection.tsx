import React from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical
} from 'lucide-react';
import { CanvasElement } from '../../../types/designPanel';

interface PositionSectionProps {
  selectedElement: CanvasElement | null;
  onElementUpdate?: (element: CanvasElement) => void;
}

const PositionSection: React.FC<PositionSectionProps> = ({ 
  selectedElement, 
  onElementUpdate 
}) => {
  const handleAlignmentChange = (alignment: string) => {
    if (selectedElement && onElementUpdate) {
      onElementUpdate(selectedElement);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-white font-medium mb-3">Position</h3>
      
      <div className="bg-gray-700 rounded p-3">
        <div className="flex space-x-1 mb-2">
          <button
            onClick={() => handleAlignmentChange('left')}
            className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors flex items-center justify-center"
            title="Align Left"
          >
            <AlignLeft size={16} className="text-white" />
          </button>
          
          <button
            onClick={() => handleAlignmentChange('center')}
            className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors flex items-center justify-center"
            title="Align Center"
          >
            <AlignCenter size={16} className="text-white" />
          </button>
          
          <button
            onClick={() => handleAlignmentChange('right')}
            className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors flex items-center justify-center"
            title="Align Right"
          >
            <AlignRight size={16} className="text-white" />
          </button>
          
          <button
            onClick={() => handleAlignmentChange('justify')}
            className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors flex items-center justify-center"
            title="Justify"
          >
            <AlignJustify size={16} className="text-white" />
          </button>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => handleAlignmentChange('top')}
            className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors flex items-center justify-center"
            title="Align Top"
          >
            <AlignStartVertical size={16} className="text-white" />
          </button>
          
          <button
            onClick={() => handleAlignmentChange('middle')}
            className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors flex items-center justify-center"
            title="Align Middle"
          >
            <AlignCenterVertical size={16} className="text-white" />
          </button>
          
          <button
            onClick={() => handleAlignmentChange('bottom')}
            className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors flex items-center justify-center"
            title="Align Bottom"
          >
            <AlignEndVertical size={16} className="text-white" />
          </button>
        </div>
      </div>

      {selectedElement && (
        <div className="mt-3 space-y-2">
          <div className="text-xs text-gray-400">Selected Element</div>
          <div className="text-sm text-white">
            Type: {selectedElement.type}
          </div>
          {('x' in selectedElement && 'y' in selectedElement) && (
            <div className="text-xs text-gray-300">
              Position: {selectedElement.x}, {selectedElement.y}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PositionSection;
