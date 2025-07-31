import { MultipartFile } from '@fastify/multipart'
import { saveFileLocally } from '../../utils/fileUtils'
import { sendToPythonWorker } from '../../utils/apiClient'
import path from 'path'
import { randomUUID } from 'crypto'

const TMP_UPLOAD_DIR = path.join(__dirname, '../../../tmp')
const CHROMA_UPLOAD_DIR = path.join(__dirname, '../../data/chroma')


async function process(file: MultipartFile) {
  const filename = `${randomUUID()}_${file.filename}`
  const filePath = await saveFileLocally(file, filename, TMP_UPLOAD_DIR)

  const result = await sendToPythonWorker(filePath)

  return result
}

async function saveChroma(file: MultipartFile) {
  const filename = `${randomUUID()}_${file.filename}`;
  const filePath = await saveFileLocally(file, filename, CHROMA_UPLOAD_DIR);

  const url = `/uploads/chroma/${filename}`;

  return {
    message: "Chroma uploaded successfully",
    filename,
    filePath,
    url,
  };
}

export const imageService = {
  process,
  saveChroma,
}
