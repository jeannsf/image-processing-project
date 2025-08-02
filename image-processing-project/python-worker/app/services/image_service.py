import os
from fastapi import HTTPException
from app.core.config import BACKGROUND_DIR, OUTPUT_DIR, INPUT_DIR

def delete_image_file(filename: str, location: str):
    if location == "output":
        location = "processed"

    dir_map = {
        "chroma": INPUT_DIR,
        "backgrounds": BACKGROUND_DIR,
        "processed": OUTPUT_DIR
    }

    if location not in dir_map:
        raise HTTPException(
            status_code=400,
            detail="Invalid location. Must be one of: chroma, backgrounds, processed."
        )

    file_path = os.path.join(dir_map[location], filename)

    abs_path = os.path.abspath(file_path)
    if not abs_path.startswith(dir_map[location]):
        raise HTTPException(status_code=400, detail="Invalid file path.")

    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        os.remove(abs_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")

