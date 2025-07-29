# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch and PyG dependencies (CPU only)
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN pip install torch-scatter -f https://data.pyg.org/whl/torch-2.3.0+cpu.html
RUN pip install torch-sparse -f https://data.pyg.org/whl/torch-2.3.0+cpu.html
RUN pip install torch-geometric

# Copy files into the image
COPY . .

# Install other Python dependencies
RUN pip install -r requirements.txt

# Expose port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
