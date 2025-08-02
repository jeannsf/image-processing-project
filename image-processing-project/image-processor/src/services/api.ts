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
