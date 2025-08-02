import axios from 'axios'

const PYTHON_BACKGROUNDS_URL = process.env.PYTHON_BACKGROUNDS_URL || 'http://localhost:8000/backgrounds'
const PYTHON_CHROMA_URL = process.env.PYTHON_CHROMA_URL || "http://localhost:8000/chroma";


export async function fetchBackgroundZip() {
  const response = await axios.get(PYTHON_BACKGROUNDS_URL, {
    responseType: 'stream',
  })

  return response
}

export async function fetchChromaZip() {
  const response = await axios.get(PYTHON_CHROMA_URL, {
    responseType: "stream",
  });
  return response;
}