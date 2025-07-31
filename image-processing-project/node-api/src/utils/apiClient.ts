import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000/process'

export async function sendToPythonWorker(filePath: string) {
  const form = new FormData()
  form.append('file', fs.createReadStream(filePath))

  const response = await axios.post(PYTHON_API_URL, form, {
    headers: form.getHeaders(),
  })

  return response.data
}
