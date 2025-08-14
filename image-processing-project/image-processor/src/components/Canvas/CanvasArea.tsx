import React, { useRef, useEffect } from "react";
import {
  CanvasElement,
  BackgroundElement,
  TextElement,
  ImageElement,
  Shape,
} from "../../types/designPanel";

interface CanvasAreaProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  onElementSelect: (element: CanvasElement | null) => void;
  onElementUpdate: (element: CanvasElement) => void;
  background: BackgroundElement | null;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  background,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleElementClick = (
    element: CanvasElement,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    onElementSelect(element);
  };

  const handleCanvasClick = () => {
    onElementSelect(null);
  };

  const renderTextElement = (element: TextElement) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      color: element.color,
      fontWeight: element.bold ? "bold" : "normal",
      fontStyle: element.italic ? "italic" : "normal",
      textDecoration: element.underline ? "underline" : "none",
      textAlign: element.alignment,
      cursor: "pointer",
      userSelect: "none",
      border: selectedElement?.id === element.id ? "2px solid #3B82F6" : "none",
      padding: "4px",
      minWidth: "100px",
    };

    return (
      <div
        key={element.id}
        style={style}
        onClick={(e) => handleElementClick(element, e)}
        className="hover:bg-blue-50 hover:bg-opacity-20"
      >
        {element.content}
      </div>
    );
  };

  const renderImageElement = (element: ImageElement) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      cursor: "pointer",
      border: selectedElement?.id === element.id ? "2px solid #3B82F6" : "none",
    };

    return (
      <img
        key={element.id}
        src={element.src}
        alt="Canvas element"
        style={style}
        onClick={(e) => handleElementClick(element, e)}
        className="hover:opacity-80"
        draggable={false}
      />
    );
  };

  const renderShapeElement = (element: Shape) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      backgroundColor: element.color,
      cursor: "pointer",
      border: selectedElement?.id === element.id ? "2px solid #3B82F6" : "none",
    };

    let shapeStyle = { ...style };

    switch (element.type) {
      case "circle":
        shapeStyle.borderRadius = "50%";
        break;
      case "triangle":
        shapeStyle = {
          ...style,
          width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderLeft: `${element.width / 2}px solid transparent`,
          borderRight: `${element.width / 2}px solid transparent`,
          borderBottom: `${element.height}px solid ${element.color}`,
        };
        break;
      case "star":
        return (
          <div
            key={element.id}
            style={{
              position: "absolute",
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              cursor: "pointer",
              border:
                selectedElement?.id === element.id
                  ? "2px solid #3B82F6"
                  : "none",
            }}
            onClick={(e) => handleElementClick(element, e)}
          >
            <svg
              width={element.width}
              height={element.height}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={element.color}
              />
            </svg>
          </div>
        );
      default:
        break;
    }

    return (
      <div
        key={element.id}
        style={shapeStyle}
        onClick={(e) => handleElementClick(element, e)}
        className="hover:opacity-80"
      />
    );
  };

  const renderElement = (element: CanvasElement) => {
    switch (element.type) {
      case "headline":
      case "body":
        return renderTextElement(element as TextElement);
      case "image":
        return renderImageElement(element as ImageElement);
      case "square":
      case "circle":
      case "triangle":
      case "star":
        return renderShapeElement(element as Shape);
      default:
        return null;
    }
  };

  const canvasStyle: React.CSSProperties = {
    backgroundColor: background?.color || "#ffffff",
    backgroundImage: background?.imageUrl
      ? `url(${background.imageUrl})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        ref={canvasRef}
        className="relative bg-white shadow-lg"
        style={{
          width: "800px",
          height: "600px",
          ...canvasStyle,
        }}
        onClick={handleCanvasClick}
      >
        {elements.map(renderElement)}

        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-gray-800 tracking-wider">
              PASS
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasArea;
