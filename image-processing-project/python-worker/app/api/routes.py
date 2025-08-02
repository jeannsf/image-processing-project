from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.file_utils import save_upload_file
from app.services.image_processor import process_image
from app.services.get_backgrounds import get_all_background_images
from app.core.config import INPUT_DIR, OUTPUT_DIR

import os

router = APIRouter()

@router.post("/process")
async def process_image_endpoint(file: UploadFile = File(...)):
    try:
        input_path = save_upload_file(file, INPUT_DIR)
        
        output_filename = process_image(input_path)
        output_path = os.path.join(OUTPUT_DIR, output_filename)

        return {
            "message": "Image processed successfully",
            "filename": output_filename,
            "url": f"/static/{output_filename}" 
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/chroma")
async def upload_chroma_image(file: UploadFile = File(...)):
    try:
        input_path = save_upload_file(file, INPUT_DIR)

        filename = os.path.basename(input_path)

        url = f"/static/chroma/{filename}"

        return {
            "message": "Chroma image uploaded successfully",
            "filename": filename,
            "url": url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/backgrounds")
def download_all_backgrounds():
    try:
        return get_all_background_images()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))