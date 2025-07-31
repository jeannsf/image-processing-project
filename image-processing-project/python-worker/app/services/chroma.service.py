import os
import uuid
from fastapi import UploadFile
from app.utils.file_utils import save_upload_file
from app.core.config import INPUT_DIR


def save_chroma_image(file: UploadFile) -> dict:
    path = save_upload_file(file, INPUT_DIR)
    filename = os.path.basename(path)

    return {
        "message": "Chroma image uploaded successfully",
        "filename": filename,
        "url": f"/static/chroma/{filename}"
    }
