import io
import zipfile
import cv2
from fastapi.responses import StreamingResponse
import numpy as np
import os
from app.core.config import BACKGROUND_DIR, OUTPUT_DIR, INPUT_DIR

def process_image(input_path: str) -> list[str]:
    chroma_files = os.listdir(INPUT_DIR)
    background_files = os.listdir(BACKGROUND_DIR)

    if not chroma_files:
        raise FileNotFoundError("No chroma key images found.")
    if not background_files:
        raise FileNotFoundError("No background images found.")

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    processed_filenames = []

    for chroma_filename in chroma_files:
        chroma_path = os.path.join(INPUT_DIR, chroma_filename)
        image = cv2.imread(chroma_path)
        if image is None:
            continue

        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        lower_green = np.array([36, 25, 25])
        upper_green = np.array([86, 255, 255])
        mask = cv2.inRange(hsv, lower_green, upper_green)
        mask_inv = cv2.bitwise_not(mask)

        fg = cv2.bitwise_and(image, image, mask=mask_inv)

        for bg_filename in background_files:
            background_path = os.path.join(BACKGROUND_DIR, bg_filename)
            background = cv2.imread(background_path)
            if background is None:
                continue

            background_resized = cv2.resize(background, (image.shape[1], image.shape[0]))
            bg = cv2.bitwise_and(background_resized, background_resized, mask=mask)

            final_image = cv2.add(fg, bg)

            chroma_base = os.path.splitext(chroma_filename)[0]
            bg_base = os.path.splitext(bg_filename)[0]
            output_filename = f"{chroma_base}_on_{bg_base}.png"
            output_path = os.path.join(OUTPUT_DIR, output_filename)

            cv2.imwrite(output_path, final_image)
            processed_filenames.append(output_filename)

    return processed_filenames



def get_all_processed_images() -> StreamingResponse:
    if not os.path.isdir(OUTPUT_DIR):
        raise FileNotFoundError("Processed images directory not found.")

    zip_stream = io.BytesIO()

    with zipfile.ZipFile(zip_stream, mode="w", compression=zipfile.ZIP_DEFLATED) as zipf:
        for filename in os.listdir(OUTPUT_DIR):
            file_path = os.path.join(OUTPUT_DIR, filename)
            if os.path.isfile(file_path):
                zipf.write(file_path, arcname=filename)

    zip_stream.seek(0)

    return StreamingResponse(
        zip_stream,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=processed_images.zip"}
    )