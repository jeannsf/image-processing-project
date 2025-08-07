import { ResultImage } from "../types";

const API_URL = process.env.REACT_APP_API_URL;
const PY_API_URL = process.env.REACT_APP_PYTHON_API_URL;

export interface Background {
  id: string;
  name: string;
  url: string;
}

export interface UploadChromaResponse {
  message: string;
  filename: string;
  url: string;
}

export interface ChromaImage {
  id: string;
  file?: File;
  previewUrl: string;
  name?: string;
}

export interface ProcessImageResponse {
  message: string;
  filename: string;
  url: string;
}


export interface ProcessImageResponse {
  message: string;
  filename: string;
  url: string;
}

export interface ProcessedImage {
  id: string;
  name: string;
  url: string;
}

export interface DeleteImageResponse {
  message: string;
}


export async function fetchBackgrounds(): Promise<Background[]> {
  const response = await fetch(`${API_URL}/images/backgrounds/list`);
  if (!response.ok) {
    throw new Error("Failed to fetch backgrounds");
  }

  const data = await response.json();

  return data.backgrounds.map((bg: Background) => ({
    ...bg,
    url: `${API_URL}${bg.url}`,
  }));
}

export async function uploadChromaImage(
  file: File
): Promise<UploadChromaResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${PY_API_URL}/chroma`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload chroma image");
  }

  return response.json();
}

export async function triggerChromaProcessing(): Promise<void> {
  const response = await fetch(`${API_URL}/images/chromas`);
  if (!response.ok) {
    throw new Error("Failed to trigger chroma processing");
  }
}

export async function fetchChromas(): Promise<ChromaImage[]> {
  const response = await fetch(`${API_URL}/images/chromas/list`);
  if (!response.ok) {
    throw new Error("Failed to fetch chromas");
  }

  const data = await response.json();

  return data.chromas.map((chroma: any) => ({
    id: chroma.id,
    name: chroma.name,
    previewUrl: `${API_URL}${chroma.url}`,
  }));
}

export async function uploadAndRefreshChromas(
  file: File
): Promise<ChromaImage[]> {
  await uploadChromaImage(file);        
  await triggerChromaProcessing();      
  const updated = await fetchChromas(); 
  return updated;
}

export async function processImageByFilename(
  filename: string
): Promise<ProcessImageResponse> {
  const response = await fetch(`${PY_API_URL}/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  });

  if (!response.ok) {
    throw new Error("Failed to process image by filename");
  }

  return response.json();
}



export async function processAndRefreshProcessedImages(
  filename: string
): Promise<ProcessedImage[]> {
  const processResponse = await fetch(`${PY_API_URL}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });

  if (!processResponse.ok) {
    throw new Error("Failed to process image by filename");
  }

  await processResponse.json();

  const processedZipResponse = await fetch(`${API_URL}/images/processed`, {
    method: "GET",
  });

  if (!processedZipResponse.ok) {
    throw new Error("Failed to download processed images zip");
  }

  const listResponse = await fetch(`${API_URL}/images/processed/list`, {
    method: "GET",
  });

  if (!listResponse.ok) {
    throw new Error("Failed to fetch processed images list");
  }

  const listData = await listResponse.json();

  return listData.processed.map((item: any) => ({
    id: item.id,
    name: item.name,
    url: `${API_URL}${item.url}`,
  }));
}

export async function fetchProcessedResults(): Promise<ResultImage[]> {
  const response = await fetch(`${API_URL}/images/processed/list`);
  if (!response.ok) {
    throw new Error("Failed to fetch processed images");
  }

  const data = await response.json();

  return data.processed.map((item: any) => ({
    id: item.id,
    name: item.name,
    url: `${API_URL}${item.url}`,
  }));
}


export async function deleteImage(
  filename: string,
  location: "chroma" | "backgrounds" | "processed"
): Promise<ChromaImage[] | ResultImage[]> {
  const response = await fetch(`${API_URL}/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, location }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }

  if (location === "chroma") {
    return fetchChromas();
  }

  if (location === "processed") {
    return fetchProcessedResults();
  }

  return [];
}

export async function uploadAndProcessGeneratedImage(
  file: File
): Promise<ProcessedImage[]> {
  const formData = new FormData();
  formData.append("file", file, file.name || "generated-image.png");

  const uploadResponse = await fetch(`${PY_API_URL}/generated`, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Falha ao enviar imagem gerada");
  }

  const uploadData = await uploadResponse.json();
  const filename = uploadData.filename;

  const processedZipResponse = await fetch(`${API_URL}/images/processed`, {
    method: "GET",
  });

  if (!processedZipResponse.ok) {
    throw new Error("Falha ao baixar o zip com as imagens processadas");
  }

  const listResponse = await fetch(`${API_URL}/images/processed/list`, {
    method: "GET",
  });

  if (!listResponse.ok) {
    throw new Error("Falha ao obter lista de imagens processadas");
  }

  const listData = await listResponse.json();

  return listData.processed.map((item: any) => ({
    id: item.id,
    name: item.name,
    url: `${API_URL}${item.url}`,
  }));
}
