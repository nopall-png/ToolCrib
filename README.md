# 🏭 PT Mattel ToolCrib AI & Predictive Maintenance System

![ToolCrib System](https://img.shields.io/badge/System-Microservices-blue)
![React](https://img.shields.io/badge/Frontend-Next.js%20React-cyan)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![AI](https://img.shields.io/badge/AI-ChromaDB%20%2B%20HuggingFace-orange)

A comprehensive Full-Stack application designed for PT Mattel Indonesia to manage machine tool cribs and spare parts. This system integrates a modern Web Dashboard, a Predictive Engine, and an advanced AI Retrieval-Augmented Generation (RAG) Chatbot.

## 🌟 Key Features

1. **Manager Dashboard (Predictive Engine)**
   - Duplicate SKU Identification.
   - Critical Spare Part Classification.
   - Min-Max Inventory Recommendations (ROP).
   - Machine Demand Forecasting using AI (Meta Prophet).
   - Purchase Optimization Engine.
2. **AI Assistant (RAG Chatbot)**
   - Context-aware answers based on PDF Data Ingestion.
   - Drag & Drop Document Analysis.
   - Fallback Retrieval-Only mode (protects against LLM hallucinations).
3. **Database Integration**
   - Supabase PostgreSQL with fully normalized tables.

---

## 🏗️ System Architecture

This project is built using a **Microservices Architecture** requiring 3 separate terminals to run concurrently.

| Service | Technology | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Next.js, TailwindCSS | `3000` | User Interface & Dashboard |
| **Main Backend** | Python, FastAPI, Supabase | `8000` | Database API & Predictive Engine |
| **AI Backend** | Python, FastAPI, ChromaDB | `8001` | RAG Chatbot & PDF Parsing |

---

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **Supabase Account** (For PostgreSQL Database)

### 2. Main Backend Setup (Terminal 1)
This service handles all database operations and predictive algorithms.
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```
**Environment Variables:** Create a `.env` file inside the `backend` folder:
```ini
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```
**Start the Server:**
```bash
uvicorn app.main:app --reload
```
*(Runs on http://localhost:8000)*

### 3. AI Chatbot Setup (Terminal 2)
This service handles the vector database and RAG engine.
```bash
cd ai
python -m venv venv
.\venv\Scripts\activate      # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```
**Initialize the Vector Database:**
Make sure your PDF is located at `ai/data/PT_Mattel_ToolCrib_Dataset.pdf`, then run:
```bash
python 1_ingest_data.py
```
*(This extracts chunks and builds the ChromaDB folder)*

**Start the AI Server:**
```bash
python app.py
```
*(Runs on http://localhost:8001)*

### 4. Web Frontend Setup (Terminal 3)
```bash
# Go to the project root
npm install
npm run dev
```
*(Runs on http://localhost:3000)*

---

## 👥 Authors
- Developed as a Final Project Case Study for PT Mattel Indonesia Bootcamp.
