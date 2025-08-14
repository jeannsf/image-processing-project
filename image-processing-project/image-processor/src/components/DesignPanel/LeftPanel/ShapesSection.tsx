import React from 'react';
import { Square, Circle, Star, Triangle } from 'lucide-react';
import { SectionProps, Shape, ShapeType } from '../../../types/designPanel';

const ShapesSection: React.FC<SectionProps> = ({ onElementAdd }) => {
  const handleAddShape = (shapeType: ShapeType) => {
    const shapeElement: Shape = {
      id: `shape-${Date.now()}`,
      type: shapeType,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      color: '#3B82F6',
    };
    onElementAdd(shapeElement);
  };

  const shapes = [
    { type: 'square' as ShapeType, icon: Square, label: 'Square' },
    { type: 'circle' as ShapeType, icon: Circle, label: 'Circle' },
    { type: 'star' as ShapeType, icon: Star, label: 'Star' },
    { type: 'triangle' as ShapeType, icon: Triangle, label: 'Triangle' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-white font-medium mb-3">Shapes</h3>
      
      <div className="grid grid-cols-4 gap-2">
        {shapes.map((shape) => {
          const IconComponent = shape.icon;
          return (
            <button
              key={shape.type}
              onClick={() => handleAddShape(shape.type)}
              className="aspect-square bg-white hover:bg-gray-100 rounded flex items-center justify-center transition-colors group"
              title={shape.label}
            >
              <IconComponent 
                size={24} 
                className="text-gray-700 group-hover:text-gray-900" 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShapesSection;
