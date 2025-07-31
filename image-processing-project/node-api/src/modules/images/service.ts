import { MultipartFile } from '@fastify/multipart'
import { saveFileLocally } from '../../utils/fileUtils'
import { sendToPythonWorker } from '../../utils/apiClient'
import path from 'path'
import { randomUUID } from 'crypto'

const TMP_UPLOAD_DIR = path.join(__dirname, '../../../tmp')

async function process(file: MultipartFile) {
  const filename = `${randomUUID()}_${file.filename}`
  const filePath = await saveFileLocally(file, filename, TMP_UPLOAD_DIR)

  const result = await sendToPythonWorker(filePath)

  return result
}

export const imageService = {
  process,
}
