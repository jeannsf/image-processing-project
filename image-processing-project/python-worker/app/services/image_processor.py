import cv2
import numpy as np
import os
from app.core.config import BACKGROUND_DIR, OUTPUT_DIR

def process_image(input_path: str) -> str:

    image = cv2.imread(input_path)
    if image is None:
        raise ValueError("Failed to read input image.")

    backgrounds = os.listdir(BACKGROUND_DIR)
    if not backgrounds:
        raise FileNotFoundError("No background images found.")
    
    background_image = cv2.imread(os.path.join(BACKGROUND_DIR, backgrounds[0]))
    background_resized = cv2.resize(background_image, (image.shape[1], image.shape[0]))

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower_green = np.array([36, 25, 25])
    upper_green = np.array([86, 255, 255])
    mask = cv2.inRange(hsv, lower_green, upper_green)

    mask_inv = cv2.bitwise_not(mask)

    fg = cv2.bitwise_and(image, image, mask=mask_inv)
    bg = cv2.bitwise_and(background_resized, background_resized, mask=mask)

    final_image = cv2.add(fg, bg)

    output_filename = os.path.basename(input_path)
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    cv2.imwrite(output_path, final_image)

    return output_filename
