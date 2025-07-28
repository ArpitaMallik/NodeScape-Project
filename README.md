# NodeScape

**NodeScape** is a full-stack web application built using **React** (frontend) and **Python (Flask)** (backend). It helps visualize algorithms and interact with them through a simple user interface.

This project is containerized using **Docker** and supports CI/CD via **GitHub Actions**.

---

## Features

- Interactive algorithm visualizations
- Responsive React-based frontend
- Python Flask backend
- Fully Dockerized
- CI/CD integrated via GitHub Actions

---

## Run the App Locally (using Docker)

### Prerequisites

Make sure Docker is installed:
- [Install Docker](https://docs.docker.com/get-docker/)

### 🐳 Pull Docker Images

```bash
docker pull arpitamallik23/nodescape-frontend:latest
docker pull arpitamallik23/nodescape-backend:latest

# Run backend on port 5000
docker run -d -p 5000:5000 arpitamallik23/nodescape-backend

# Run frontend on port 3000
docker run -d -p 3000:80 arpitamallik23/nodescape-frontend
```

Now open your browser and go to:

Frontend: http://localhost:3000

Backend: http://localhost:5000
