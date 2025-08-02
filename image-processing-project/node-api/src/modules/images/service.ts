import { fetchBackgroundZip, fetchChromaZip } from "../../utils/apiClient";
import path from "path";
import {
  Background,
  BackgroundDownloadResponse,
  ChromaDownloadResponse,
  ChromaImage,
} from "./types";
import unzipper from "unzipper";
import fs from "fs";
import fsp from "fs/promises";

const BACKGROUND_DIR = path.join(__dirname, "../../data/backgrounds");
const STATIC_URL_PREFIX = "/static/backgrounds";

const CHROMA_DIR = path.join(__dirname, "../../data/chroma");
const STATIC_URL_PREFIX_CHROMA = "/static/chroma";

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

export const imageService = {
  fetchAndSaveBackgrounds,
  listBackgrounds,
  listChromas,
  fetchAndSaveChromas,
};
