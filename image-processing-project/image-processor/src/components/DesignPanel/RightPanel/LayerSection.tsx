import React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { CanvasElement } from '../../../types/designPanel';

interface LayerSectionProps {
  selectedElement: CanvasElement | null;
  onElementUpdate?: (element: CanvasElement) => void;
  onClearCanvas: () => void;
}

const LayerSection: React.FC<LayerSectionProps> = ({ 
  selectedElement, 
  onElementUpdate,
  onClearCanvas 
}) => {
  const handleDuplicate = () => {
    if (selectedElement && onElementUpdate) {
      const duplicatedElement = {
        ...selectedElement,
        id: `${selectedElement.type}-${Date.now()}`,
        ...(('x' in selectedElement && 'y' in selectedElement) && {
          x: selectedElement.x + 20,
          y: selectedElement.y + 20,
        })
      };
      onElementUpdate(duplicatedElement);
    }
  };

  const handleDelete = () => {

    console.log('Delete element:', selectedElement?.id);
  };

  return (
    <div className="mb-6">
      <h3 className="text-white font-medium mb-3">Layer</h3>
      
      <div className="space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={handleDuplicate}
            disabled={!selectedElement}
            className="flex-1 p-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors flex items-center justify-center space-x-2"
            title="Duplicate"
          >
            <Copy size={16} className="text-white" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={!selectedElement}
            className="flex-1 p-2 bg-gray-600 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors flex items-center justify-center space-x-2"
            title="Delete"
          >
            <Trash2 size={16} className="text-white" />
          </button>
        </div>

        <button
          onClick={onClearCanvas}
          className="w-full mt-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm font-medium"
        >
          Clear Canvas
        </button>
      </div>

      {selectedElement && (
        <div className="mt-4 p-3 bg-gray-700 rounded">
          <div className="text-xs text-gray-400 mb-1">Layer Info</div>
          <div className="text-sm text-white">
            ID: {selectedElement.id}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Type: {selectedElement.type}
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerSection;