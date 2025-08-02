export interface ProcessImageResponse {
  message: string;
  filename: string;
  url: string;
}

export interface ErrorResponse {
  message: string;
  error?: unknown;
}

export interface SaveChromaResponse {
  message: string;
  filename: string;
  url: string;
  filePath: string;
}

export interface BackgroundDownloadResponse {
  message: string
  targetDir: string
}

export interface ErrorResponse {
  message: string
  error?: unknown
}

export interface Background {
  id: string
  name: string
  url: string
}

export interface BackgroundListResponse {
  message: string
  backgrounds: Background[]
}

export interface ErrorResponse {
  message: string
  error?: unknown
}
