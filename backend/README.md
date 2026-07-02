# 🚀 ToolCrib AI Backend & Predictive Engine

Sistem ini adalah tulang punggung (Database, FastAPI, dan Machine Learning) untuk aplikasi **ToolCrib** (Mattel). Arsitektur ini dirancang menggunakan Python, terhubung dengan *Supabase PostgreSQL*, dan dilengkapi dengan algoritma cerdas *Facebook Prophet* untuk memprediksi stok barang.

---

## 🏗️ Struktur Proyek
- **`/app`** : Berisi kerangka utama Backend (FastAPI, Models, Database Connection).
- **`/app/ai`** : Berisi algoritma *Machine Learning* (ABC/XYZ Analysis & Time-Series Prophet).
- **`/ToolCrib`** : Berisi aplikasi *Frontend* (Next.js & React).

---

## 🛠️ Cara Instalasi (Untuk Tim Developer)

Karena folder `venv` dan file `.env` diabaikan oleh `.gitignore` demi keamanan, ikuti langkah-langkah di bawah ini setelah melakukan `git clone / git pull` agar aplikasi bisa berjalan di laptopmu!

### 🟢 Langkah 1: Siapkan Backend & AI (Python)

1. Buka terminal di direktori utama proyek (`bootcamp_mattel_backend`).
2. Buat Virtual Environment baru:
   ```bash
   python -m venv venv
   ```
3. Aktifkan Virtual Environment:
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
4. Install semua pustaka raksasa (FastAPI, Prophet, dll):
   ```bash
   pip install -r requirements.txt
   ```
5. **[SANGAT PENTING]** Hubungkan ke Database Supabase:
   - Buat file baru bernama `.env` di folder ini (sejajar dengan `main.py`).
   - *Copy-paste* isi dari file `.env.example` ke dalam file `.env` tersebut.
   - Ganti tulisan `[PASSWORD_SUPABASE]` dan nama proyek dengan kredensial Supabase milik tim kita.
6. Nyalakan Mesin Backend & AI:
   ```bash
   uvicorn app.main:app --reload
   ```
   *(Tunggu beberapa saat sampai muncul notifikasi "Model NLP Semantik berhasil dimuat").*

### 🔵 Langkah 2: Siapkan Frontend (Next.js)

1. Buka terminal baru (biarkan terminal *backend* Python tetap menyala).
2. Masuk ke folder Frontend:
   ```bash
   cd ToolCrib
   ```
3. Install seluruh pustaka UI (Tailwind, React, dll):
   ```bash
   npm install
   ```
4. Nyalakan server Frontend:
   ```bash
   npm run dev
   ```
5. Aplikasi siap diakses di browser melalui alamat **`http://localhost:3000`**

---

## 🤖 Catatan Untuk Presentasi
Pastikan komputer memiliki koneksi internet yang stabil karena *Backend* secara *real-time* berkomunikasi dengan AWS Supabase, dan *Prophet AI* melakukan kalkulasi secara langsung saat Control Panel dibuka.
