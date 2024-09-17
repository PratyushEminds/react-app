from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import base64
import cv2
import numpy as np
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt

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

# Save uploaded images


@app.post("/upload_and_detect")
async def upload_and_detect_image(file: UploadFile = File(...)):
    # Save the uploaded file
    file_path = UPLOAD_FOLDER / file.filename
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Load the image using OpenCV
    image = cv2.imread(str(file_path))

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur to smooth the image and reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Apply Laplacian of Gaussian (LoG) to detect edges
    laplacian = cv2.Laplacian(blurred, cv2.CV_64F)
    laplacian = np.absolute(laplacian)
    laplacian = np.uint8(255 * laplacian / np.max(laplacian))

    # Reshape the image data for anomaly detection
    pixels = laplacian.reshape(-1, 1)

    # Apply Isolation Forest for anomaly detection
    clf = IsolationForest(contamination=0.01)
    labels = clf.fit_predict(pixels)

    # Reshape labels back to the image shape
    anomalies = labels.reshape(laplacian.shape)
    anomalies = (anomalies == -1).astype(np.uint8)

    # Use morphological transformations to highlight vertical lines
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 10))
    detected_lines = cv2.morphologyEx(
        anomalies, cv2.MORPH_OPEN, vertical_kernel)

    # Find contours (lines)
    contours, _ = cv2.findContours(
        detected_lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Create a copy of the original image to draw the detected lines
    image_with_lines = image.copy()

    # Count the total number of vertical lines
    total_lines = 0
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if h > 2 * w:
            total_lines += 1
            cv2.rectangle(image_with_lines, (x, y),
                          (x + w, y + h), (0, 255, 0), 2)

    # Save the result image with vertical lines highlighted
    output_image_path = UPLOAD_FOLDER / f"output_{file.filename}"
    cv2.imwrite(str(output_image_path), image_with_lines)

    # Convert the output image to Base64
    with open(output_image_path, "rb") as output_image_file:
        encoded_image = base64.b64encode(
            output_image_file.read()).decode("utf-8")

    # Create the response object with Base64 image and total number of lines
    response = {
        "filename": file.filename,
        "base64_image": encoded_image,
        "detected_lines_count": total_lines,
        "message": f"Total number of vertical lines detected: {total_lines}"
    }

    return response
