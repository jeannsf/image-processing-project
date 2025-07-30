from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(
    title="Image Processor API",
    version="1.0.0",
    docs_url="/docs",       
    redoc_url="/redoc"
)

app.include_router(router)
