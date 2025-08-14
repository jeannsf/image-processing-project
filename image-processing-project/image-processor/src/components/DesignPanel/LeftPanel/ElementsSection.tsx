import React from 'react';
import { Type, AlignLeft } from 'lucide-react';
import { SectionProps, TextElement } from '../../../types/designPanel';

const ElementsSection: React.FC<SectionProps> = ({ onElementAdd }) => {
  const handleAddHeadline = () => {
    const headlineElement: TextElement = {
      id: `headline-${Date.now()}`,
      type: 'headline',
      content: 'Headline',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      fontSize: 32,
      fontFamily: 'Inter',
      color: '#000000',
      bold: true,
      italic: false,
      underline: false,
      alignment: 'left',
      zIndex: 1,
      locked: false,
      visible: true,
    };
    onElementAdd(headlineElement);
  };

  const handleAddBodyText = () => {
    const bodyTextElement: TextElement = {
      id: `body-${Date.now()}`,
      type: 'body',
      content: 'Body Text',
      x: 100,
      y: 200,
      width: 300,
      height: 100,
      rotation: 0,
      fontSize: 16,
      fontFamily: 'Inter',
      color: '#000000',
      bold: false,
      italic: false,
      underline: false,
      alignment: 'left',
      zIndex: 1,
      locked: false,
      visible: true,
    };
    onElementAdd(bodyTextElement);
  };

  return (
    <div className="mb-6">
      <div className="space-y-3">
        <button
          onClick={handleAddHeadline}
          className="w-full text-left p-3 hover:bg-gray-700 rounded transition-colors flex items-center space-x-3"
        >
          <Type size={18} className="text-gray-400" />
          <div>
            <div className="text-white font-semibold text-lg">Headline</div>
          </div>
        </button>

        <button
          onClick={handleAddBodyText}
          className="w-full text-left p-3 hover:bg-gray-700 rounded transition-colors flex items-center space-x-3"
        >
          <AlignLeft size={18} className="text-gray-400" />
          <div>
            <div className="text-white text-sm">Body Text</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ElementsSection;
