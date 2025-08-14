import React, { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { DesignPanelProps, CanvasElement, DesignPanelState, BackgroundElement } from '../../types/designPanel';

import ElementsSection from './LeftPanel/ElementsSection';
import ImagesSection from './LeftPanel/ImagesSection';
import ShapesSection from './LeftPanel/ShapesSection';
import BackgroundSection from './LeftPanel/BackgroundSection';
import PositionSection from './RightPanel/PositionSection';
import LayerSection from './RightPanel/LayerSection';
import TextSection from './RightPanel/TextSection';
import CanvasArea from '../Canvas/CanvasArea';

const DesignPanel: React.FC<DesignPanelProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  const [designState, setDesignState] = useState<DesignPanelState>({
    selectedElement: null,
    elements: [],
    canvasBackground: null,
    history: [[]],
    historyIndex: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      setIsOpening(true);
      
      // Pequeno delay para mostrar o conteúdo após o fade-in inicial
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 100);
      
      const openingTimer = setTimeout(() => {
        setIsOpening(false);
      }, 800);
      
      return () => {
        clearTimeout(contentTimer);
        clearTimeout(openingTimer);
      };
    } else if (isVisible) {
      setIsClosing(true);
      setIsOpening(false);
      setShowContent(false);
      
      const closingTimer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 350);
      
      return () => clearTimeout(closingTimer);
    }
  }, [isOpen, isVisible]);

  const handleElementAdd = useCallback((element: CanvasElement) => {
    setDesignState(prev => {
      const newElements = [...prev.elements, element];
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newElements);
      
      return {
        ...prev,
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const handleElementUpdate = useCallback((updatedElement: CanvasElement) => {
    setDesignState(prev => {
      const newElements = prev.elements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      );
      
      return {
        ...prev,
        elements: newElements,
      };
    });
  }, []);

  const handleElementSelect = useCallback((element: CanvasElement | null) => {
    setDesignState(prev => ({
      ...prev,
      selectedElement: element,
    }));
  }, []);

  const handleUndo = useCallback(() => {
    setDesignState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          elements: prev.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setDesignState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          elements: prev.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const handleClearCanvas = useCallback(() => {
    setDesignState(prev => {
      const newHistory = [...prev.history, []];
      return {
        ...prev,
        elements: [],
        selectedElement: null,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const handleClose = () => {
    onClose();
  };

  if (!isVisible) return null;

  const isAnimatingIn = isOpen && !isClosing;
  const isAnimatingOut = isClosing;

  return (
    <>
      <div 
        className={`
          fixed inset-0 z-40
          transition-opacity duration-300 ease-in-out
          ${isAnimatingIn 
            ? 'opacity-100' 
            : 'opacity-0'
          }
        `}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div 
        className={`
          fixed inset-0 z-50 flex
          transition-all duration-500 ease-out
          ${isAnimatingIn 
            ? 'backdrop-blur-sm' 
            : isAnimatingOut 
              ? 'backdrop-blur-none' 
              : 'backdrop-blur-none'
          }
        `}
        style={{
          backgroundColor: isAnimatingIn 
            ? 'rgba(0, 0, 0, 0.4)' 
            : isAnimatingOut 
              ? 'rgba(0, 0, 0, 0)' 
              : 'rgba(0, 0, 0, 0)',
          transition: isOpening 
            ? 'background-color 600ms cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 600ms cubic-bezier(0.16, 1, 0.3, 1)' 
            : 'background-color 300ms ease-in-out, backdrop-filter 300ms ease-in-out',
        }}
      >
        <div 
          className={`
            bg-white w-full h-full flex shadow-2xl
            transition-all ease-out transform
            ${showContent 
              ? 'scale-100 opacity-100 translate-y-0' 
              : isAnimatingOut 
                ? 'scale-95 opacity-0 translate-y-4' 
                : 'scale-90 opacity-0 translate-y-8'
            }
          `}
          style={{
            transitionDuration: isOpening ? '700ms' : '300ms',
            transitionDelay: isOpening ? '150ms' : '0ms',
            transitionTimingFunction: isOpening 
              ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
              : 'ease-in-out',
          }}
        >
          <div 
            className={`
              absolute top-0 left-0 right-0 h-12 bg-gray-800 text-white flex items-center justify-between px-4 z-10
              transition-all ease-out transform
              ${showContent 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-[-100%] opacity-0'
              }
            `}
            style={{
              transitionDuration: isOpening ? '500ms' : '300ms',
              transitionDelay: isOpening ? '350ms' : (isAnimatingOut ? '0ms' : '0ms'),
              transitionTimingFunction: isOpening 
                ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                : 'ease-in-out',
            }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Folder / Pass</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-700 rounded transition-all duration-200 hover:rotate-90 transform hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex w-full pt-12">
            <div 
              className={`
                w-80 bg-gray-800 text-white overflow-y-auto
                transition-all ease-out transform
                ${showContent 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-[-100%] opacity-0'
                }
              `}
              style={{
                transitionDuration: isOpening ? '600ms' : '400ms',
                transitionDelay: isOpening ? '300ms' : '0ms',
                transitionTimingFunction: isOpening 
                  ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                  : 'ease-in-out',
              }}
            >
              <div className="p-4">
                <h2 
                  className={`
                    text-lg font-semibold mb-4
                    transition-all ease-out
                    ${showContent 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0'
                    }
                  `}
                  style={{
                    transitionDuration: isOpening ? '400ms' : '300ms',
                    transitionDelay: isOpening ? '500ms' : '0ms',
                    transitionTimingFunction: isOpening 
                      ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                      : 'ease-in-out',
                  }}
                >
                  Elements
                </h2>
                
                <div 
                  className={`
                    transition-all ease-out
                    ${showContent 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-6 opacity-0 scale-95'
                    }
                  `}
                  style={{
                    transitionDuration: isOpening ? '500ms' : '300ms',
                    transitionDelay: isOpening ? '550ms' : '0ms',
                    transitionTimingFunction: isOpening 
                      ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                      : 'ease-in-out',
                  }}
                >
                  <ElementsSection 
                    onElementAdd={handleElementAdd}
                    selectedElement={designState.selectedElement}
                    onElementUpdate={handleElementUpdate}
                  />
                </div>
                
                <div 
                  className={`
                    transition-all ease-out
                    ${showContent 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-6 opacity-0 scale-95'
                    }
                  `}
                  style={{
                    transitionDuration: isOpening ? '500ms' : '300ms',
                    transitionDelay: isOpening ? '600ms' : '0ms',
                    transitionTimingFunction: isOpening 
                      ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                      : 'ease-in-out',
                  }}
                >
                  <ImagesSection 
                    onElementAdd={handleElementAdd}
                    selectedElement={designState.selectedElement}
                    onElementUpdate={handleElementUpdate}
                  />
                </div>
                
                <div 
                  className={`
                    transition-all ease-out
                    ${showContent 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-6 opacity-0 scale-95'
                    }
                  `}
                  style={{
                    transitionDuration: isOpening ? '500ms' : '300ms',
                    transitionDelay: isOpening ? '650ms' : '0ms',
                    transitionTimingFunction: isOpening 
                      ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                      : 'ease-in-out',
                  }}
                >
                  <ShapesSection 
                    onElementAdd={handleElementAdd}
                    selectedElement={designState.selectedElement}
                    onElementUpdate={handleElementUpdate}
                  />
                </div>
                
                <div 
                  className={`
                    transition-all ease-out
                    ${showContent 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-6 opacity-0 scale-95'
                    }
                  `}
                  style={{
                    transitionDuration: isOpening ? '500ms' : '300ms',
                    transitionDelay: isOpening ? '700ms' : '0ms',
                    transitionTimingFunction: isOpening 
                      ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                      : 'ease-in-out',
                  }}
                >
                  <BackgroundSection 
                    onElementAdd={handleElementAdd}
                    selectedElement={designState.selectedElement}
                    onElementUpdate={handleElementUpdate}
                  />
                </div>
              </div>
            </div>

            <div 
              className={`
                flex-1 bg-gray-100 flex flex-col
                transition-all ease-out transform
                ${showContent 
                  ? 'scale-100 opacity-100' 
                  : 'scale-95 opacity-0'
                }
              `}
              style={{
                transitionDuration: isOpening ? '700ms' : '300ms',
                transitionDelay: isOpening ? '400ms' : '0ms',
                transitionTimingFunction: isOpening 
                  ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                  : 'ease-in-out',
              }}
            >
              <CanvasArea
                elements={designState.elements}
                selectedElement={designState.selectedElement}
                onElementSelect={handleElementSelect}
                onElementUpdate={handleElementUpdate}
                background={designState.canvasBackground}
              />
              
              <div 
                className={`
                  h-16 bg-gray-200 flex items-center justify-center space-x-4
                  transition-all ease-out transform
                  ${showContent 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-[100%] opacity-0'
                  }
                `}
                style={{
                  transitionDuration: isOpening ? '500ms' : '300ms',
                  transitionDelay: isOpening ? '750ms' : '0ms',
                  transitionTimingFunction: isOpening 
                    ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                    : 'ease-in-out',
                }}
              >
                <button
                  onClick={handleUndo}
                  disabled={designState.historyIndex === 0}
                  className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md transform hover:scale-105"
                >
                  Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={designState.historyIndex === designState.history.length - 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md transform hover:scale-105"
                >
                  Redo
                </button>
              </div>
            </div>

            <div 
              className={`
                w-80 bg-gray-800 text-white overflow-y-auto
                transition-all ease-out transform
                ${showContent 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-[100%] opacity-0'
                }
              `}
              style={{
                transitionDuration: isOpening ? '600ms' : '400ms',
                transitionDelay: isOpening ? '300ms' : '0ms',
                transitionTimingFunction: isOpening 
                  ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                  : 'ease-in-out',
              }}
            >
              <div className="p-4">
                <div 
                  className={`
                    transition-all ease-out
                    ${showContent 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-6 opacity-0 scale-95'
                    }
                  `}
                  style={{
                    transitionDuration: isOpening ? '500ms' : '300ms',
                    transitionDelay: isOpening ? '550ms' : '0ms',
                    transitionTimingFunction: isOpening 
                      ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                      : 'ease-in-out',
                  }}
                >
                  <PositionSection 
                    selectedElement={designState.selectedElement}
                    onElementUpdate={handleElementUpdate}
                  />
                </div>
                
                <div 
                  className={`
                    transition-all ease-out
                    ${showContent 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-6 opacity-0 scale-95'
                    }
                  `}
                  style={{
                    transitionDuration: isOpening ? '500ms' : '300ms',
                    transitionDelay: isOpening ? '600ms' : '0ms',
                    transitionTimingFunction: isOpening 
                      ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                      : 'ease-in-out',
                  }}
                >
                  <LayerSection 
                    selectedElement={designState.selectedElement}
                    onElementUpdate={handleElementUpdate}
                    onClearCanvas={handleClearCanvas}
                  />
                </div>
                
                <div 
                  className={`
                    transition-all ease-out
                    ${showContent 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-6 opacity-0 scale-95'
                    }
                  `}
                  style={{
                    transitionDuration: isOpening ? '500ms' : '300ms',
                    transitionDelay: isOpening ? '650ms' : '0ms',
                    transitionTimingFunction: isOpening 
                      ? 'cubic-bezier(0.16, 1, 0.3, 1)' 
                      : 'ease-in-out',
                  }}
                >
                  <TextSection 
                    selectedElement={designState.selectedElement}
                    onElementUpdate={handleElementUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPanel;
