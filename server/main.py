from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import base64
import cv2
import numpy as np
from sklearn.ensemble import IsolationForest

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_FOLDER = Path("uploaded_images")
UPLOAD_FOLDER.mkdir(exist_ok=True)


@app.post("/upload_and_detect")
async def upload_and_detect_image(files: list[UploadFile] = File(...)):
    results = []

    for file in files:

        file_path = UPLOAD_FOLDER / file.filename
        with open(file_path, "wb") as f:
            f.write(await file.read())

        image = cv2.imread(str(file_path))

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        laplacian = cv2.Laplacian(blurred, cv2.CV_64F)
        laplacian = np.absolute(laplacian)
        laplacian = np.uint8(255 * laplacian / np.max(laplacian))

        pixels = laplacian.reshape(-1, 1)

        clf = IsolationForest(contamination=0.01)
        labels = clf.fit_predict(pixels)

        anomalies = labels.reshape(laplacian.shape)
        anomalies = (anomalies == -1).astype(np.uint8)

        vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 10))
        detected_lines = cv2.morphologyEx(
            anomalies, cv2.MORPH_OPEN, vertical_kernel)

        contours, _ = cv2.findContours(
            detected_lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        image_with_lines = image.copy()

        total_lines = 0
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            if h > 2 * w:
                total_lines += 1
                cv2.rectangle(image_with_lines, (x, y),
                              (x + w, y + h), (0, 255, 0), 2)

        output_image_path = UPLOAD_FOLDER / f"output_{file.filename}"
        cv2.imwrite(str(output_image_path), image_with_lines)

        with open(output_image_path, "rb") as output_image_file:
            encoded_image = base64.b64encode(
                output_image_file.read()).decode("utf-8")

        results.append({
            "filename": file.filename,
            "base64_image": encoded_image,
            "detected_lines_count": total_lines,
            "message": f"Total number of vertical lines detected: {total_lines}"
        })

    return results
