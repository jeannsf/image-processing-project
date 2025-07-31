import os
import shutil
import uuid
from fastapi import UploadFile

def save_upload_file(upload_file: UploadFile, destination_folder: str) -> str:
    os.makedirs(destination_folder, exist_ok=True)
    
    extension = os.path.splitext(upload_file.filename)[-1]
    unique_filename = f"{uuid.uuid4()}{extension}"
    destination_path = os.path.join(destination_folder, unique_filename)

    with open(destination_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return destination_path