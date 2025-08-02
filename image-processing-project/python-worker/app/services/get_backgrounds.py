import os
import io
import zipfile
from fastapi.responses import StreamingResponse
from app.core.config import BACKGROUND_DIR

def get_all_background_images():
    if not os.path.isdir(BACKGROUND_DIR):
        raise FileNotFoundError("Background directory not found.")

    zip_stream = io.BytesIO()

    with zipfile.ZipFile(zip_stream, mode="w", compression=zipfile.ZIP_DEFLATED) as zipf:
        for filename in os.listdir(BACKGROUND_DIR):
            file_path = os.path.join(BACKGROUND_DIR, filename)
            if os.path.isfile(file_path):
                zipf.write(file_path, arcname=filename)

    zip_stream.seek(0)

    return StreamingResponse(
        zip_stream,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=backgrounds.zip"}
    )
