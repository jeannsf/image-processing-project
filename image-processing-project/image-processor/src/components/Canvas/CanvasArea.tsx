import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  RotateCcw,
  Plus,
  Edit3,
  Copy,
  Lock,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  CanvasElement,
  TextElement,
  ImageElement,
  Shape,
  DragState,
  ResizeHandle,
  CanvasAreaProps,
} from "../../types/designPanel";

const CanvasArea: React.FC<CanvasAreaProps> = ({
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  background,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    isRotating: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startRotation: 0,
  });

  const calculateRotation = useCallback(
    (centerX: number, centerY: number, mouseX: number, mouseY: number) => {
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    },
    []
  );

  const getMousePosition = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent,
      element: CanvasElement,
      action: "drag" | "resize" | "rotate",
      handle?: ResizeHandle
    ) => {
      e.preventDefault();
      e.stopPropagation();

      onElementSelect(element);

      const mousePos = getMousePosition(e);

      if (
        "x" in element &&
        "y" in element &&
        "width" in element &&
        "height" in element
      ) {
        setDragState({
          isDragging: action === "drag",
          isResizing: action === "resize",
          isRotating: action === "rotate",
          startX: mousePos.x,
          startY: mousePos.y,
          startWidth: element.width,
          startHeight: element.height,
          startRotation: element.rotation || 0,
          resizeHandle: handle,
        });
      }
    },
    [onElementSelect, getMousePosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (
        !selectedElement ||
        (!dragState.isDragging &&
          !dragState.isResizing &&
          !dragState.isRotating)
      )
        return;
      if (!("x" in selectedElement && "y" in selectedElement)) return;

      const mousePos = getMousePosition(e);
      const deltaX = mousePos.x - dragState.startX;
      const deltaY = mousePos.y - dragState.startY;

      let updatedElement = { ...selectedElement };

      if (dragState.isDragging) {
        updatedElement.x = Math.max(0, selectedElement.x + deltaX);
        updatedElement.y = Math.max(0, selectedElement.y + deltaY);

        setDragState((prev) => ({
          ...prev,
          startX: mousePos.x,
          startY: mousePos.y,
        }));
      } else if (
        dragState.isResizing &&
        dragState.resizeHandle &&
        "width" in selectedElement &&
        "height" in selectedElement
      ) {
        const handle = dragState.resizeHandle;
        let newWidth = dragState.startWidth;
        let newHeight = dragState.startHeight;
        let newX = selectedElement.x;
        let newY = selectedElement.y;

        switch (handle) {
          case "top-left":
            newWidth = Math.max(20, dragState.startWidth - deltaX);
            newHeight = Math.max(20, dragState.startHeight - deltaY);
            newX = selectedElement.x + (dragState.startWidth - newWidth);
            newY = selectedElement.y + (dragState.startHeight - newHeight);
            break;
          case "top-right":
            newWidth = Math.max(20, dragState.startWidth + deltaX);
            newHeight = Math.max(20, dragState.startHeight - deltaY);
            newY = selectedElement.y + (dragState.startHeight - newHeight);
            break;
          case "bottom-left":
            newWidth = Math.max(20, dragState.startWidth - deltaX);
            newHeight = Math.max(20, dragState.startHeight + deltaY);
            newX = selectedElement.x + (dragState.startWidth - newWidth);
            break;
          case "bottom-right":
            newWidth = Math.max(20, dragState.startWidth + deltaX);
            newHeight = Math.max(20, dragState.startHeight + deltaY);
            break;
          case "top":
            newHeight = Math.max(20, dragState.startHeight - deltaY);
            newY = selectedElement.y + (dragState.startHeight - newHeight);
            break;
          case "bottom":
            newHeight = Math.max(20, dragState.startHeight + deltaY);
            break;
          case "left":
            newWidth = Math.max(20, dragState.startWidth - deltaX);
            newX = selectedElement.x + (dragState.startWidth - newWidth);
            break;
          case "right":
            newWidth = Math.max(20, dragState.startWidth + deltaX);
            break;
        }

        updatedElement.x = Math.max(0, newX);
        updatedElement.y = Math.max(0, newY);
        updatedElement.width = newWidth;
        updatedElement.height = newHeight;
      } else if (
        dragState.isRotating &&
        "width" in selectedElement &&
        "height" in selectedElement
      ) {
        const centerX = selectedElement.x + selectedElement.width / 2;
        const centerY = selectedElement.y + selectedElement.height / 2;
        const rotation = calculateRotation(
          centerX,
          centerY,
          mousePos.x,
          mousePos.y
        );
        updatedElement.rotation = rotation;
      }

      onElementUpdate(updatedElement);
    },
    [
      selectedElement,
      dragState,
      getMousePosition,
      onElementUpdate,
      calculateRotation,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      isResizing: false,
      isRotating: false,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startRotation: 0,
    });
  }, []);

  useEffect(() => {
    if (dragState.isDragging || dragState.isResizing || dragState.isRotating) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

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

  const handleDuplicate = (element: CanvasElement) => {
    if ("x" in element && "y" in element) {
      const duplicatedElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
      };
      onElementUpdate(duplicatedElement);
    }
  };

  const ElementToolbar: React.FC<{ element: CanvasElement }> = ({
    element,
  }) => {
    if (
      !(
        "x" in element &&
        "y" in element &&
        "width" in element &&
        "height" in element
      )
    )
      return null;
    if (selectedElement?.id !== element.id) return null;

    return (
      <div
        className="absolute bg-white rounded-lg shadow-lg border border-gray-200 flex items-center px-2 py-1 space-x-1 z-50"
        style={{
          top: -45,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <button
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Edit"
        >
          <Edit3 size={14} className="text-blue-600" />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Rotate"
        >
          <RotateCcw size={14} className="text-gray-600" />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Lock"
        >
          <Lock size={14} className="text-gray-600" />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Duplicate"
          onClick={() => handleDuplicate(element)}
        >
          <Copy size={14} className="text-gray-600" />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Delete"
        >
          <Trash2 size={14} className="text-gray-600" />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="More"
        >
          <MoreHorizontal size={14} className="text-gray-600" />
        </button>
      </div>
    );
  };

  const ResizeHandles: React.FC<{ element: CanvasElement }> = ({ element }) => {
    if (
      !(
        "x" in element &&
        "y" in element &&
        "width" in element &&
        "height" in element
      )
    )
      return null;
    if (selectedElement?.id !== element.id) return null;

    const cornerHandles: {
      position: ResizeHandle;
      style: React.CSSProperties;
    }[] = [
      {
        position: "top-left",
        style: { top: -6, left: -6, cursor: "nw-resize" },
      },
      {
        position: "top-right",
        style: { top: -6, right: -6, cursor: "ne-resize" },
      },
      {
        position: "bottom-left",
        style: { bottom: -6, left: -6, cursor: "sw-resize" },
      },
      {
        position: "bottom-right",
        style: { bottom: -6, right: -6, cursor: "se-resize" },
      },
    ];

    const edgeHandles: {
      position: ResizeHandle;
      style: React.CSSProperties;
    }[] = [
      {
        position: "top",
        style: {
          top: -3,
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "n-resize",
        },
      },
      {
        position: "bottom",
        style: {
          bottom: -3,
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "s-resize",
        },
      },
      {
        position: "left",
        style: {
          left: -3,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "w-resize",
        },
      },
      {
        position: "right",
        style: {
          right: -3,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "e-resize",
        },
      },
    ];

    return (
      <>
        <div
          className="absolute pointer-events-none"
          style={{
            top: -2,
            left: -2,
            width: "calc(100% + 4px)",
            height: "calc(100% + 4px)",
            border: "2px dashed #8B5CF6",
            borderRadius: "2px",
          }}
        />

        {cornerHandles.map((handle) => (
          <div
            key={handle.position}
            className="absolute w-3 h-3 bg-white border-2 border-gray-300 rounded-full hover:border-purple-500 transition-colors shadow-sm"
            style={handle.style}
            onMouseDown={(e) =>
              handleMouseDown(e, element, "resize", handle.position)
            }
          />
        ))}

        {edgeHandles.map((handle) => (
          <div
            key={handle.position}
            className="absolute w-2 h-2 bg-white border border-gray-300 hover:border-purple-500 transition-colors shadow-sm"
            style={handle.style}
            onMouseDown={(e) =>
              handleMouseDown(e, element, "resize", handle.position)
            }
          />
        ))}

        <div
          className="absolute flex space-x-2"
          style={{
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "12px",
          }}
        >
          <button
            className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element, "rotate")}
            title="Rotate"
          >
            <RotateCcw size={14} className="text-gray-600" />
          </button>

          <button
            className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => handleDuplicate(element)}
            title="Duplicate"
          >
            <Plus size={14} className="text-gray-600" />
          </button>
        </div>
      </>
    );
  };

  const renderTextElement = (element: TextElement) => {
    const isSelected = selectedElement?.id === element.id;

    const containerStyle: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation || 0}deg)`,
      transformOrigin: "center",
      zIndex: element.zIndex || 1,
    };

    const textStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      color: element.color,
      fontWeight: element.bold ? "bold" : "normal",
      fontStyle: element.italic ? "italic" : "normal",
      textDecoration: element.underline ? "underline" : "none",
      textAlign: element.alignment,
      cursor: element.locked ? "default" : "move",
      userSelect: "none",
      padding: "8px",
      opacity: element.visible !== false ? 1 : 0.5,
      backgroundColor: "transparent",
      outline: "none",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent:
        element.alignment === "center"
          ? "center"
          : element.alignment === "right"
          ? "flex-end"
          : "flex-start",
    };

    return (
      <div key={element.id} style={containerStyle}>
        <div
          style={textStyle}
          onMouseDown={(e) =>
            !element.locked && handleMouseDown(e, element, "drag")
          }
          onClick={(e) => handleElementClick(element, e)}
          className={`${
            isSelected ? "" : "hover:bg-blue-50 hover:bg-opacity-20"
          }`}
        >
          {element.content}
        </div>
        <ElementToolbar element={element} />
        <ResizeHandles element={element} />
      </div>
    );
  };

  const renderImageElement = (element: ImageElement) => {
    const isSelected = selectedElement?.id === element.id;

    const containerStyle: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation || 0}deg)`,
      transformOrigin: "center",
      zIndex: element.zIndex || 1,
    };

    const imageStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      cursor: element.locked ? "default" : "move",
      opacity: element.visible !== false ? 1 : 0.5,
      objectFit: "cover",
    };

    return (
      <div key={element.id} style={containerStyle}>
        <img
          src={element.src}
          alt="Canvas element"
          style={imageStyle}
          onMouseDown={(e) =>
            !element.locked && handleMouseDown(e, element, "drag")
          }
          onClick={(e) => handleElementClick(element, e)}
          className={`${isSelected ? "" : "hover:opacity-80"}`}
          draggable={false}
        />
        <ElementToolbar element={element} />
        <ResizeHandles element={element} />
      </div>
    );
  };

  const renderShapeElement = (element: Shape) => {
    const isSelected = selectedElement?.id === element.id;

    const containerStyle: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation || 0}deg)`,
      transformOrigin: "center",
      zIndex: element.zIndex || 1,
    };

    const shapeStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      backgroundColor: element.color,
      cursor: element.locked ? "default" : "move",
      opacity: element.visible !== false ? 1 : 0.5,
    };

    switch (element.type) {
      case "circle":
        shapeStyle.borderRadius = "50%";
        break;
      case "triangle":
        return (
          <div key={element.id} style={containerStyle}>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${element.width / 2}px solid transparent`,
                borderRight: `${element.width / 2}px solid transparent`,
                borderBottom: `${element.height}px solid ${element.color}`,
                cursor: element.locked ? "default" : "move",
                opacity: element.visible !== false ? 1 : 0.5,
              }}
              onMouseDown={(e) =>
                !element.locked && handleMouseDown(e, element, "drag")
              }
              onClick={(e) => handleElementClick(element, e)}
              className={`${isSelected ? "" : "hover:opacity-80"}`}
            />
            <ElementToolbar element={element} />
            <ResizeHandles element={element} />
          </div>
        );
      case "star":
        return (
          <div key={element.id} style={containerStyle}>
            <div
              style={{
                width: "100%",
                height: "100%",
                cursor: element.locked ? "default" : "move",
                opacity: element.visible !== false ? 1 : 0.5,
              }}
              onMouseDown={(e) =>
                !element.locked && handleMouseDown(e, element, "drag")
              }
              onClick={(e) => handleElementClick(element, e)}
              className={`${isSelected ? "" : "hover:opacity-80"}`}
            >
              <svg width="100%" height="100%" viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={element.color}
                />
              </svg>
            </div>
            <ElementToolbar element={element} />
            <ResizeHandles element={element} />
          </div>
        );
      default:
        break;
    }

    return (
      <div key={element.id} style={containerStyle}>
        <div
          style={shapeStyle}
          onMouseDown={(e) =>
            !element.locked && handleMouseDown(e, element, "drag")
          }
          onClick={(e) => handleElementClick(element, e)}
          className={`${isSelected ? "" : "hover:opacity-80"}`}
        />
        <ElementToolbar element={element} />
        <ResizeHandles element={element} />
      </div>
    );
  };

  const renderElement = (element: CanvasElement) => {
    if ("visible" in element && element.visible === false) return null;

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
    backgroundColor: background?.color || "#f5f5f5",
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
        className="relative bg-white shadow-lg overflow-visible"
        style={{
          width: "800px",
          height: "600px",
          ...canvasStyle,
        }}
        onClick={handleCanvasClick}
      >
        {elements
          .sort((a, b) => {
            const aZ = "zIndex" in a ? a.zIndex || 0 : 0;
            const bZ = "zIndex" in b ? b.zIndex || 0 : 0;
            return aZ - bZ;
          })
          .map(renderElement)}

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
