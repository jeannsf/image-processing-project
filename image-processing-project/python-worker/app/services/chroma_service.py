import os
import uuid
from fastapi import UploadFile
from app.utils.file_utils import save_upload_file
from app.core.config import INPUT_DIR
import io
import zipfile
from starlette.responses import StreamingResponse

def save_chroma_image(file: UploadFile) -> dict:
    path = save_upload_file(file, INPUT_DIR)
    filename = os.path.basename(path)

    return {
        "message": "Chroma image uploaded successfully",
        "filename": filename,
        "url": f"/static/chroma/{filename}"
    }

def get_all_chroma_images() -> StreamingResponse:
    if not os.path.isdir(INPUT_DIR):
        raise FileNotFoundError("Chroma directory not found.")

    zip_stream = io.BytesIO()

    with zipfile.ZipFile(zip_stream, mode="w", compression=zipfile.ZIP_DEFLATED) as zipf:
        for filename in os.listdir(INPUT_DIR):
            file_path = os.path.join(INPUT_DIR, filename)
            if os.path.isfile(file_path):
                zipf.write(file_path, arcname=filename)

    zip_stream.seek(0)

    return StreamingResponse(
        zip_stream,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=chroma_images.zip"}
    )