import io
import zipfile
import cv2
from fastapi.responses import StreamingResponse
import numpy as np
import os
from app.core.config import BACKGROUND_DIR, OUTPUT_DIR

def process_image(input_path: str) -> list[str]:
    image = cv2.imread(input_path)
    if image is None:
        raise ValueError("Failed to read input image.")

    backgrounds = os.listdir(BACKGROUND_DIR)
    if not backgrounds:
        raise FileNotFoundError("No background images found.")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    processed_filenames = []

    for bg_filename in backgrounds:
        background_image = cv2.imread(os.path.join(BACKGROUND_DIR, bg_filename))
        background_resized = cv2.resize(background_image, (image.shape[1], image.shape[0]))

        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        lower_green = np.array([36, 25, 25])
        upper_green = np.array([86, 255, 255])
        mask = cv2.inRange(hsv, lower_green, upper_green)

        mask_inv = cv2.bitwise_not(mask)

        fg = cv2.bitwise_and(image, image, mask=mask_inv)
        bg = cv2.bitwise_and(background_resized, background_resized, mask=mask)

        final_image = cv2.add(fg, bg)

        base_name = os.path.splitext(os.path.basename(input_path))[0]
        bg_base_name = os.path.splitext(bg_filename)[0]
        output_filename = f"{base_name}_processed_with_{bg_base_name}.png"
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