# ZPDS

Project for product management in data science classes

## Frontend

Requierements: Node.js (pref 22.16V)

Used: Vite + React

### Installation:

1. Move to /frontend/my-app
2. Use command:

```bash
npm install
```

### Usage

```bash
npm run dev
```

Application will run on port 5173

## Backend

Requierements: Python 3.11

Used: Flask + SQLITE

### Setup

Create virtual enviroment

```
python -m venv backend\venv
.\backend\venv\Scripts\Activate.ps1
```

Install requirements.txt

```
pip install -r backend\requirements.txt
```

Set environment variables

```
echo OPENAI_API_KEY="backend\YOUR_API_KEY" > .env
```

### Usage

```
python .\backend\app.py
```
