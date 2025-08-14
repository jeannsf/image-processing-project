export interface Background {
  id: string;
  name: string;
  url?: string;
  thumbnail?: string;
}

export interface ResultImage {
  id: string;
  name: string;
  url: string;
  originalChroma?: string;
  background?: string;
  createdAt: Date;
}

export interface SidebarItem {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  progress?: number;
  message?: string;
}

export interface BackgroundImage {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

export interface ChromaImage {
  id: string;
  name: string;
  url: string;
  file?: File;
}

export interface ProcessedImage {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  originalChroma: any;
  background: string;
  createdAt: Date;
}

export interface ChromaImage {
  id: string;
  name: string;
  url: string;
  file?: File;
}

export interface UploadedImage {
  id: string;
  name: string;
  url: string;
  file: File;
}

export interface Result {
  id: string;
  name: string;
  url: string;
}

export interface ResultPanelProps {
  results: Result[];
  loading: boolean;
  onChange: (results: Result[]) => void;
}

export interface IndividualEditorProps {
  backgrounds: Background[];
  chromaImages: ChromaImage[];
  onClose: () => void;
  onImageExported?: (image: ProcessedImage) => void;
}

export interface ChromaKeyPanelProps {
  images: ChromaImage[];
  onChange: (images: ChromaImage[]) => void;
}

export type SidebarItemId = 
  | 'design'
  | 'elements'
  | 'text'
  | 'brand'
  | 'uploads'
  | 'tools'
  | 'projects'
  | 'apps'
  | 'magic';

export interface SidebarItems {
  id: SidebarItemId;
  icon: React.ElementType;
  label: string;
}

export interface SidebarProps {
  activeItem: SidebarItemId;
  onItemClick?: (id: SidebarItemId) => void;
}
