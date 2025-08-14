export interface DesignPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ElementType = 'headline' | 'body' | 'image' | 'shape' | 'background';

export type ShapeType = 'square' | 'circle' | 'star' | 'triangle';

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface TextElement {
  id: string;
  type: 'headline' | 'body';
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: AlignmentType;
}

export interface ImageElement {
  id: string;
  type: 'image';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BackgroundElement {
  id: string;
  type: 'background';
  color?: string;
  imageUrl?: string;
}

export type CanvasElement = TextElement | ImageElement | Shape | BackgroundElement;

export type AlignmentType = 'left' | 'center' | 'right' | 'justify';

export interface TextFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  fontSize: number;
  fontFamily: string;
  alignment: AlignmentType;
}

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

export interface DesignPanelState {
  selectedElement: CanvasElement | null;
  elements: CanvasElement[];
  canvasBackground: BackgroundElement | null;
  history: CanvasElement[][];
  historyIndex: number;
}

export interface SectionProps {
  onElementAdd: (element: CanvasElement) => void;
  selectedElement?: CanvasElement | null;
  onElementUpdate?: (element: CanvasElement) => void;
}

export interface ImageUploadOptions {
  type: 'upload' | 'url';
  file?: File;
  url?: string;
}

export interface FontOption {
  value: string;
  label: string;
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  neutral: string[];
}
