import { deleteImageOnPython, fetchBackgroundZip, fetchChromaZip, fetchProcessedZip } from "../../utils/apiClient";
import path from "path";
import {
  Background,
  BackgroundDownloadResponse,
  ChromaDownloadResponse,
  ChromaImage,
  ProcessedDownloadResponse,
  ProcessedImage,
} from "./types";
import unzipper from "unzipper";
import fs from "fs";
import fsp from "fs/promises";

const BACKGROUND_DIR = path.join(__dirname, "../../data/backgrounds");
const STATIC_URL_PREFIX = "/static/backgrounds";

const CHROMA_DIR = path.join(__dirname, "../../data/chroma");
const STATIC_URL_PREFIX_CHROMA = "/static/chroma";

const PROCESSED_DIR = path.join(__dirname, "../../data/processed");
const STATIC_URL_PREFIX_PROCESSED = "/static/processed";

const DIR_MAP: Record<string, string> = {
  chroma: path.join(__dirname, "../../data/chroma"),
  backgrounds: path.join(__dirname, "../../data/backgrounds"),
  processed: path.join(__dirname, "../../data/processed"),
};


async function fetchAndSaveBackgrounds(): Promise<BackgroundDownloadResponse> {
  if (!fs.existsSync(BACKGROUND_DIR)) {
    fs.mkdirSync(BACKGROUND_DIR, { recursive: true });
  }

  const response = await fetchBackgroundZip();

  if (response.status !== 200) {
    throw new Error(`Failed to fetch backgrounds. Status: ${response.status}`);
  }

  const extractStream = response.data.pipe(
    unzipper.Extract({ path: BACKGROUND_DIR })
  );

  await new Promise((resolve, reject) => {
    extractStream.on("close", resolve);
    extractStream.on("error", reject);
  });

  return {
    message: "Backgrounds downloaded and extracted successfully",
    targetDir: BACKGROUND_DIR,
  };
}

async function listBackgrounds(): Promise<Background[]> {
  const files = await fsp.readdir(BACKGROUND_DIR);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|gif|bmp)$/i.test(file)
  );

  return imageFiles.map((file, idx) => ({
    id: `bg-${idx}`,
    name: file,
    url: `${STATIC_URL_PREFIX}/${file}`,
  }));
}

async function fetchAndSaveChromas(): Promise<ChromaDownloadResponse> {
  if (!fs.existsSync(CHROMA_DIR)) {
    fs.mkdirSync(CHROMA_DIR, { recursive: true });
  }

  const response = await fetchChromaZip();

  if (response.status !== 200) {
    throw new Error(`Failed to fetch chromas. Status: ${response.status}`);
  }

  const extractStream = response.data.pipe(
    unzipper.Extract({ path: CHROMA_DIR })
  );

  await new Promise((resolve, reject) => {
    extractStream.on("close", () => {
      console.log("Extraction finished");
      resolve(undefined);
    });
    extractStream.on("error", () => {
      console.error("Extraction error");
      reject();
    });
  });

  return {
    message: "Chromas downloaded and extracted successfully",
    targetDir: CHROMA_DIR,
  };
}

async function listChromas(): Promise<ChromaImage[]> {
  const files = await fsp.readdir(CHROMA_DIR);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|gif|bmp)$/i.test(file)
  );

  return imageFiles.map((file, idx) => ({
    id: `chroma-${idx}`,
    name: file,
    url: `${STATIC_URL_PREFIX_CHROMA}/${file}`,
  }));
}

async function fetchAndSaveProcessed(): Promise<ProcessedDownloadResponse> {
  if (!fs.existsSync(PROCESSED_DIR)) {
    fs.mkdirSync(PROCESSED_DIR, { recursive: true });
  }

  const response = await fetchProcessedZip();

  if (response.status !== 200) {
    throw new Error(
      `Failed to fetch processed images. Status: ${response.status}`
    );
  }

  const extractStream = response.data.pipe(
    unzipper.Extract({ path: PROCESSED_DIR })
  );

  await new Promise((resolve, reject) => {
    extractStream.on("close", resolve);
    extractStream.on("error", reject);
  });

  return {
    message: "Processed images downloaded and extracted successfully",
    targetDir: PROCESSED_DIR,
  };
}

async function listProcessed(): Promise<ProcessedImage[]> {
  const files = await fsp.readdir(PROCESSED_DIR);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|gif|bmp)$/i.test(file)
  );

  return imageFiles.map((file, idx) => ({
    id: `processed-${idx}`,
    name: file,
    url: `${STATIC_URL_PREFIX_PROCESSED}/${file}`,
  }));
}

 async function deleteImage(filename: string, location: string): Promise<void> {
  if (!filename || !location || !(location in DIR_MAP)) {
    throw new Error("Invalid filename or location");
  }

  await deleteImageOnPython(filename, location);

  const dirPath = DIR_MAP[location];
  const filePath = path.resolve(path.join(dirPath, filename));

  if (!filePath.startsWith(dirPath)) {
    throw new Error("Invalid file path");
  }

  await fsp.unlink(filePath);
}

export const imageService = {
  fetchAndSaveBackgrounds,
  listBackgrounds,
  listChromas,
  fetchAndSaveChromas,
  fetchAndSaveProcessed,
  listProcessed,
  deleteImage,
};
