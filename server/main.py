from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

app = FastAPI()

# Allow CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your frontend domain if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store uploaded images
UPLOAD_FOLDER = Path("uploaded_images")
UPLOAD_FOLDER.mkdir(exist_ok=True)


@app.post("/upload")
async def upload_images(files: list[UploadFile] = File(...)):
    for file in files:
        file_path = UPLOAD_FOLDER / file.filename
        with open(file_path, "wb") as f:
            f.write(await file.read())
    return {"message": "Files uploaded successfully"}
