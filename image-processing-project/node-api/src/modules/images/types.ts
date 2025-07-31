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
