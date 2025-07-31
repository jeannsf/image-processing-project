import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = os.path.join(BASE_DIR, "..", "data")
INPUT_DIR = os.path.abspath(os.path.join(DATA_DIR, "chroma"))
OUTPUT_DIR = os.path.abspath(os.path.join(DATA_DIR, "output"))
BACKGROUND_DIR = os.path.abspath(os.path.join(DATA_DIR, "backgrounds"))