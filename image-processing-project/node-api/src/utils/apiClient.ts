import axios from 'axios'

const PYTHON_BACKGROUNDS_URL = process.env.PYTHON_BACKGROUNDS_URL || 'http://localhost:8000/backgrounds'
const PYTHON_CHROMA_URL = process.env.PYTHON_CHROMA_URL || "http://localhost:8000/chroma";
const PYTHON_RESULTS_URL = process.env.PYTHON_RESULTS_URL || "http://localhost:8000/results";
const PYTHON_DELETE_URL = process.env.PYTHON_DELETE_URL || "http://localhost:8000";


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


export async function fetchProcessedZip() {
  const response = await axios.get(PYTHON_RESULTS_URL, {
    responseType: "stream",
  });
  return response;
}

export async function deleteImageOnPython(filename: string, location: string) {
  const pythonLocation = location === "processed" ? "output" : location;

  const response = await axios.delete(`${PYTHON_DELETE_URL}/image`, {
    data: { filename, location: pythonLocation },
  });

  return response.data;
}