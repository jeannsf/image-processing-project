// Tipos gerais
export type ElementType = 'headline' | 'body' | 'image' | 'shape' | 'background';
export type ShapeType = 'square' | 'circle' | 'star' | 'triangle';
export type AlignmentType = 'left' | 'center' | 'right' | 'justify';

// Props do painel
export interface DesignPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Transformações de posição e tamanho
export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

// Elementos
export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  zIndex: number;
  locked: boolean;
  visible: boolean;
}

export interface TextElement {
  id: string;
  type: 'headline' | 'body';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: AlignmentType;
  zIndex: number;
  locked: boolean;
  visible: boolean;
}

export interface ImageElement {
  id: string;
  type: 'image';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export interface BackgroundElement {
  id: string;
  type: 'background';
  color?: string;
  imageUrl?: string;
}

// Union de elementos
export type CanvasElement = TextElement | ImageElement | Shape | BackgroundElement;

// Formatação de texto
export interface TextFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  fontSize: number;
  fontFamily: string;
  alignment: AlignmentType;
}

// Controles de posição, camada e seleção
export interface PositionControls {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface LayerControls {
  zIndex: number;
  visible: boolean;
  locked: boolean;
}

// Estado do painel
export interface DesignPanelState {
  selectedElement: CanvasElement | null;
  elements: CanvasElement[];
  canvasBackground: BackgroundElement | null;
  history: CanvasElement[][];
  historyIndex: number;
}

// Props de seções
export interface SectionProps {
  onElementAdd: (element: CanvasElement) => void;
  selectedElement?: CanvasElement | null;
  onElementUpdate?: (element: CanvasElement) => void;
}

// Upload de imagens
export interface ImageUploadOptions {
  type: 'upload' | 'url';
  file?: File;
  url?: string;
}

// Fontes e cores
export interface FontOption {
  value: string;
  label: string;
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  neutral: string[];
}

// Manipulação de elementos
export type ResizeHandle = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right';

export interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  isRotating: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startRotation: number;
  resizeHandle?: ResizeHandle;
}

// Props do CanvasArea
export interface CanvasAreaProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  onElementSelect: (element: CanvasElement | null) => void;
  onElementUpdate: (element: CanvasElement) => void;
  background: BackgroundElement | null;
}

// Limites de elementos
export interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}
