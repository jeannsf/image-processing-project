import { MultipartFile } from '@fastify/multipart'
import { saveFileLocally } from '../../utils/fileUtils'
import { sendToChromaWorker, sendToPythonWorker } from '../../utils/apiClient'
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
  const filename = `${randomUUID()}_${file.filename}`
  const filePath = await saveFileLocally(file, filename, CHROMA_UPLOAD_DIR)

  const result = await sendToChromaWorker(filePath)

  return result
}

export const imageService = {
  process,
  saveChroma,
}
