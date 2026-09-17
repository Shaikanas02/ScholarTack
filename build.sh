#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "==> Installing Python backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Building React + TypeScript frontend bundle..."
cd frontend
npm install
npm run build
cd ..

echo "==> Build completed successfully! Frontend assets ready in frontend/dist."
