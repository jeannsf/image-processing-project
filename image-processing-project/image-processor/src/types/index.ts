export interface Background {
  id: string;
  name: string;
  url: string;
  thumbnail?: string; 
}

export interface ChromaImage {
  id: string;
  file?: File;
  previewUrl: string;
  name?: string;
  url?: string; 
  thumbnail?: string; 
  processedUrl?: string;
}

export interface ResultImage {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  createdAt?: string;
}

export interface ChromaStyles {
  scale: number;
  positionX: number;
  positionY: number;
  rotation: number;
  opacity: number;
  blendMode?: string; 
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export interface ProcessRequest {
  chromaImageName: string;
  backgroundId?: string;
  styles?: ChromaStyles;
}

export interface ProcessResponse {
  success: boolean;
  results: ResultImage[];
  message?: string;
}