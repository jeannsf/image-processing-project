import fs from 'fs'
import path from 'path'
import { MultipartFile } from '@fastify/multipart'

export async function saveFileLocally(
  file: MultipartFile,
  filename: string,
  directory: string
): Promise<string> {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }

  const filePath = path.join(directory, filename)
  const buffer = await file.toBuffer()
  fs.writeFileSync(filePath, buffer)

  return filePath
}