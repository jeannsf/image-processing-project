from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.utils.file_utils import save_upload_file
from app.services.image_processor import get_all_processed_images, process_image
from app.services.get_backgrounds import get_all_background_images
from app.services.chroma_service import get_all_chroma_images
from app.core.config import INPUT_DIR, OUTPUT_DIR

import os

router = APIRouter()

class FilenameRequest(BaseModel):
    filename: str

@router.post("/process")
def process_by_filename(data: FilenameRequest):
    input_path = os.path.join(INPUT_DIR, data.filename)

    if not os.path.exists(input_path):
        raise HTTPException(status_code=404, detail="File not found")

    output_filenames = process_image(input_path)

    return {
        "message": "Image processed successfully",
        "filenames": output_filenames,
        "urls": [f"/static/{f}" for f in output_filenames]
    }
    

@router.post("/chroma")
async def upload_chroma_image(file: UploadFile = File(...)):
    try:
        input_path = save_upload_file(file, INPUT_DIR)

        filename = os.path.basename(input_path)
        url = f"/static/chroma/{filename}"

        return JSONResponse(
            status_code=200,
            content={
                "message": "Chroma image uploaded successfully",
                "filename": filename,
                "url": url,
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/backgrounds")
def download_all_backgrounds():
    try:
        return get_all_background_images()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chroma")
def download_all_chroma_images():
    try:
        return get_all_chroma_images()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/results")
def download_all_processed_images():
    try:
        return get_all_processed_images()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
