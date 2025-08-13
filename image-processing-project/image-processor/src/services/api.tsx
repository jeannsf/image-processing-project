import { Background, ChromaImage, ProcessedImage, UploadedImage } from "../types";

export const fetchBackgrounds = async (): Promise<Background[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'bg-1',
      name: 'Studio Background 1',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=150&fit=crop'
    },
    {
      id: 'bg-2',
      name: 'Office Background',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop'
    },
    {
      id: 'bg-3',
      name: 'Nature Background',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop'
    },
    {
      id: 'bg-4',
      name: 'City Background',
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop'
    }
  ];
};

export const fetchChromas = async (): Promise<ChromaImage[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [];
};

export const fetchProcessedResults = async (): Promise<ProcessedImage[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [];
};

export const processAndRefreshProcessedImages = async (chromaFileName: string): Promise<ProcessedImage[]> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return [
    {
      id: `processed-${Date.now()}`,
      name: `processed-${chromaFileName}`,
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      originalChroma: chromaFileName,
      background: 'Studio Background 1',
      createdAt: new Date(),
    }
  ];
};

export const uploadImage = async (file: File): Promise<UploadedImage> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `upload-${Date.now()}`,
    name: file.name,
    url: URL.createObjectURL(file),
    file: file
  };
};

export const deleteProcessedImage = async (imageId: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true };
};
