import { MultipartFile } from "@fastify/multipart";
import { saveFileLocally } from "../../utils/fileUtils";
import {
  fetchBackgroundZip,
  sendToChromaWorker,
  sendToPythonWorker,
} from "../../utils/apiClient";
import path from "path";
import { randomUUID } from "crypto";
import { BackgroundDownloadResponse } from "./types";
import unzipper from "unzipper";
import fs from "fs";

const TMP_UPLOAD_DIR = path.join(__dirname, "../../../tmp");
const CHROMA_UPLOAD_DIR = path.join(__dirname, "../../data/chroma");
const BACKGROUND_DIR = path.join(__dirname, "../../data/backgrounds");

async function process(file: MultipartFile) {
  const filename = `${randomUUID()}_${file.filename}`;
  const filePath = await saveFileLocally(file, filename, TMP_UPLOAD_DIR);

  const result = await sendToPythonWorker(filePath);

  return result;
}

async function saveChroma(file: MultipartFile) {
  const filename = `${randomUUID()}_${file.filename}`;
  const filePath = await saveFileLocally(file, filename, CHROMA_UPLOAD_DIR);

  const result = await sendToChromaWorker(filePath);

  return result;
}

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

export const imageService = {
  process,
  saveChroma,
  fetchAndSaveBackgrounds,
};
