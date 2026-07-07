import pandas as pd
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uuid

from app.database import get_db
from app.models import Role, User, SparePart, InventoryTransaction, Machine, SparepartRequest, SparepartRequestItem
from app.schemas import LoginRequest, SparePartCreate, MachineCreate, RequestCreate, RequestStatusUpdate, UserCreate
# Kita undang Koki AI kita masuk ke dapur utama
from app.ai.engine import ToolCribPredictiveEngine

# -------------------------------------------------------------------
# PROTOKOL SINGLETON: Muat otak AI sekali saja saat server dinyalakan
# -------------------------------------------------------------------
ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🧠 MENYUNTIKKAN OTAK AI KE DALAM GATEWAY...")
    ml_models["predictive_engine"] = ToolCribPredictiveEngine()
    yield
    ml_models.clear()
    print("💤 OTAK AI DIMATIKAN.")


app = FastAPI(
    title="Mattel Smart Inventory & Predictive Maintenance API",
    description="Core Enterprise Gateway + AI Engine Integration - by Arda Nugraha",
    version="3.0.0-PROD-AI",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root_check():
    return {
        "system": "Mattel Smart Inventory Backend",
        "status": "ONLINE",
        "ai_status": "READY" if "predictive_engine" in ml_models else "OFFLINE"
    }

# =====================================================================
# RUTE GETTERS KLASIK KITA TADI PAGI (6 GERBANG MASUK)
# =====================================================================
@app.get("/api/v1/roles", tags=["Master Data"])
def get_master_roles(db: Session = Depends(get_db)):
    return {"status": "SUCCESS", "data": db.query(Role).all()}

@app.get("/api/v1/users", tags=["Human Resources"])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    results = []
    for u in users:
        role = db.query(Role).filter(Role.id == u.role_id).first()
        results.append({
            "id": str(u.id),
            "employee_id": u.employee_id,
            "full_name": u.full_name,
            "email": u.email or f"{u.full_name.lower().replace(' ', '.')}@toolcrib.ai",
            "department_shift": u.department_shift,
            "network_status": u.network_status,
            "role_name": role.role_name.upper() if role else "UNKNOWN",
            "last_active": "Just now" if u.network_status == "ACTIVE" else "Offline"
        })
    return {"status": "SUCCESS", "data": results}

@app.post("/api/v1/users", tags=["Human Resources"])
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.employee_id == data.employee_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Employee ID {data.employee_id} already exists.")
    
    new_user = User(
        employee_id=data.employee_id,
        full_name=data.full_name,
        password_hash=data.password_hash,
        role_id=data.role_id,
        department_shift=data.department_shift,
        email=data.email,
        network_status=data.network_status
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "SUCCESS", "data": new_user}

@app.delete("/api/v1/users/{employee_id}", tags=["Human Resources"])
def delete_user(employee_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.employee_id == employee_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"status": "SUCCESS", "message": f"Deleted user {employee_id}"}

@app.get("/api/v1/spare-parts", tags=["Warehouse & AI"])
def get_all_spareparts(db: Session = Depends(get_db)):
    return {"status": "SUCCESS", "data": db.query(SparePart).all()}

@app.get("/api/v1/machines", tags=["Factory Floor"])
def get_all_machines(db: Session = Depends(get_db)):
    return {"status": "SUCCESS", "data": db.query(Machine).all()}

@app.get("/api/v1/transactions", tags=["Warehouse Log"])
def get_all_transactions(db: Session = Depends(get_db)):
    return {"status": "SUCCESS", "data": db.query(InventoryTransaction).all()}

@app.get("/api/v1/requests", tags=["Approval Bureaucracy"])
def get_all_requests(db: Session = Depends(get_db)):
    reqs = db.query(SparepartRequest).all()
    results = []
    for r in reqs:
        user = db.query(User).filter(User.id == r.requestor_id).first()
        machine = db.query(Machine).filter(Machine.machine_id == r.machine_id).first()
        
        # Ambil daftar barang dari tabel detail
        items_db = db.query(SparepartRequestItem).filter(SparepartRequestItem.request_id == r.request_id).all()
        items_list = []
        total_quantity = 0
        part_names = []
        
        for item in items_db:
            part = db.query(SparePart).filter(SparePart.sku == item.sku).first()
            p_name = part.part_name if part else item.sku
            part_names.append(p_name)
            total_quantity += item.quantity
            items_list.append({
                "sku": item.sku,
                "part_name": p_name,
                "quantity": item.quantity
            })
            
        # Format ringkasan nama barang untuk UI lama
        if len(part_names) == 1:
            display_name = part_names[0]
        elif len(part_names) > 1:
            display_name = f"{part_names[0]} + {len(part_names)-1} other(s)"
        else:
            display_name = "Unknown"
        
        results.append({
            "request_id": r.request_id,
            "quantity": total_quantity,
            "urgency": r.urgency,
            "document_url": r.document_url,
            "approval_status": r.approval_status,
            "created_at": str(r.created_at)[:19] if r.created_at else "",
            "requestor_name": user.full_name if user else "System",
            "requestor_shift": user.department_shift if user else "General",
            "part_name": display_name,
            "machine_name": machine.machine_name if machine else r.machine_id,
            "items": items_list # Disisipkan untuk Accordion di UI baru
        })
    return {"status": "SUCCESS", "data": results}


# =====================================================================
# GERBANG SIHIR KECERDASAN BUATAN (AI PREDICTIVE ROUTES)
# =====================================================================

# ---------------------------------------------------------------------
# AI SIHIR 1: Deteksi Barang Duplikat lewat Makna Kata (NLP)
# ---------------------------------------------------------------------
@app.get("/api/v1/ai/detect-duplicates", tags=["AI Predictive Engine"])
def ai_detect_duplicates(threshold: float = 0.60, db: Session = Depends(get_db)):
    parts = db.query(SparePart).all()
    if not parts:
        raise HTTPException(status_code=404, detail="Gudang kosong, tidak ada data untuk dianalisa.")

    # 1. Terjemahkan objek Postgres jadi tabel Pandas
    df_sku = pd.DataFrame([{
        "SKU_ID": p.sku,
        "Description": f"{p.part_name} {p.category or ''} {p.specifications or ''}".strip() # <--- Operasi plastik nama kolom agar Koki AI paham
    } for p in parts])

    # 2. Suapkan ke Koki AI
    engine: ToolCribPredictiveEngine = ml_models["predictive_engine"]
    result_df = engine.detect_duplicate_sku(df_sku, threshold=threshold)

    # 3. Muntahkan ke browser Front-End
    return {
        "status": "SUCCESS",
        "total_duplicate_pairs_detected": len(result_df),
        "data": result_df.to_dict(orient="records")
    }


# ---------------------------------------------------------------------
# AI SIHIR 2: Kalkulasi Klasifikasi ABC/XYZ & Dynamic Min-Max Stok
# ---------------------------------------------------------------------
@app.get("/api/v1/ai/abc-xyz-analysis", tags=["AI Predictive Engine"])
def ai_abc_xyz_analysis(db: Session = Depends(get_db)):
    parts = db.query(SparePart).all()
    trxs = db.query(InventoryTransaction).all()

    if not parts or not trxs:
        raise HTTPException(status_code=400, detail="Data Master Barang atau Log Transaksi masih kosong!")

    # Terjemahkan Master Barang
    df_sku = pd.DataFrame([{
        "SKU_ID": p.sku,
        "Description": p.part_name,
        "Unit_Price": float(p.unit_price if p.unit_price else 0),
        "Lead_Time_Days": p.lead_time_days if p.lead_time_days else 14, # <--- Ambil dari DB, default 14
        "Criticality_Level": p.criticality_level or "MEDIUM"
    } for p in parts])

    # Terjemahkan Log Transaksi
    df_trx = pd.DataFrame([{
        "SKU_ID": t.sku,
        "Date": t.transaction_date,
        "Quantity_Issued": t.quantity
    } for t in trxs])

    engine: ToolCribPredictiveEngine = ml_models["predictive_engine"]
    result_df = engine.calculate_abc_xyz_and_minmax(df_sku, df_trx)

    return {
        "status": "SUCCESS",
        "total_sku_analyzed": len(result_df),
        "data": result_df.to_dict(orient="records")
    }


# ---------------------------------------------------------------------
# AI SIHIR 3: Ramalan Stok Masa Depan (Prophet Time-Series)
# ---------------------------------------------------------------------
@app.get("/api/v1/ai/forecast/{target_sku}", tags=["AI Predictive Engine"])
def ai_forecast_sku(target_sku: str, days_ahead: int = 30, db: Session = Depends(get_db)):
    trxs = db.query(InventoryTransaction).filter(InventoryTransaction.sku == target_sku).all()
    
    if not trxs:
        raise HTTPException(status_code=404, detail=f"Barang dengan SKU {target_sku} tidak memiliki riwayat transaksi!")

    df_trx = pd.DataFrame([{
        "SKU_ID": t.sku,
        "Date": t.transaction_date.replace(tzinfo=None) if t.transaction_date else None,
        "Quantity_Issued": t.quantity
    } for t in trxs])

    engine: ToolCribPredictiveEngine = ml_models["predictive_engine"]
    result_df = engine.forecast_stock(df_trx, target_sku, days_ahead=days_ahead)

    if result_df.empty:
        raise HTTPException(status_code=500, detail="Mesin Prophet gagal membuat ramalan untuk SKU ini.")

    return {
        "status": "SUCCESS",
        "target_sku": target_sku,
        "forecast_period_days": days_ahead,
        "predictions": result_df.to_dict(orient="records")
    }


# ---------------------------------------------------------------------
# AI SIHIR 4: Klasifikasi Kekritisan Suku Cadang (Critical Spare Engine)
# ---------------------------------------------------------------------
@app.get("/api/v1/ai/critical-spare-classification", tags=["AI Predictive Engine"])
def ai_critical_spare_classification(db: Session = Depends(get_db)):
    parts = db.query(SparePart).all()
    trxs = db.query(InventoryTransaction).all()
    machines = db.query(Machine).all()

    if not parts or not trxs:
        raise HTTPException(status_code=400, detail="Data Master Barang atau Log Transaksi masih kosong!")

    df_sku = pd.DataFrame([{
        "SKU_ID": p.sku,
        "Description": p.part_name,
        "Unit_Price": float(p.unit_price if p.unit_price else 0),
        "Lead_Time_Days": p.lead_time_days if p.lead_time_days else 14,
    } for p in parts])

    df_trx = pd.DataFrame([{
        "SKU_ID": t.sku,
        "Date": t.transaction_date,
        "Quantity_Issued": t.quantity
    } for t in trxs])

    df_machines = pd.DataFrame([{
        "Machine_ID": m.machine_id,
        "Machine_Name": m.machine_name,
        "Required_Parts": m.required_spare_parts or [],
        "Downtime_Impact": m.downtime_impact or "MEDIUM",
        "Status": m.status or "HEALTHY",
    } for m in machines])

    engine: ToolCribPredictiveEngine = ml_models["predictive_engine"]
    result_df = engine.classify_critical_spares(df_sku, df_trx, df_machines)

    return {
        "status": "SUCCESS",
        "total_sku_analyzed": len(result_df),
        "data": result_df.to_dict(orient="records")
    }


# ---------------------------------------------------------------------
# AI SIHIR 5: Peluang Optimasi Inventaris & Pembelian
# ---------------------------------------------------------------------
@app.get("/api/v1/ai/optimization-opportunities", tags=["AI Predictive Engine"])
def ai_optimization_opportunities(db: Session = Depends(get_db)):
    parts = db.query(SparePart).all()
    trxs = db.query(InventoryTransaction).all()

    if not parts or not trxs:
        raise HTTPException(status_code=400, detail="Data Master Barang atau Log Transaksi masih kosong!")

    df_sku = pd.DataFrame([{
        "SKU_ID": p.sku,
        "Description": p.part_name,
        "Unit_Price": float(p.unit_price if p.unit_price else 0),
        "Lead_Time_Days": p.lead_time_days if p.lead_time_days else 14,
        "Criticality_Level": p.criticality_level or "MEDIUM",
        "Current_Stock": int(p.current_stock if p.current_stock else 0),
    } for p in parts])

    df_trx = pd.DataFrame([{
        "SKU_ID": t.sku,
        "Date": t.transaction_date,
        "Quantity_Issued": t.quantity
    } for t in trxs])

    engine: ToolCribPredictiveEngine = ml_models["predictive_engine"]
    result_df = engine.generate_optimization_opportunities(df_sku, df_trx)

    overstock_count = len(result_df[result_df['Action'] == 'OVERSTOCK'])
    understock_count = len(result_df[result_df['Action'] == 'UNDERSTOCK'])
    slow_moving_count = len(result_df[result_df['Action'] == 'SLOW_MOVING'])
    total_excess_value = float(result_df['Excess_Value'].sum())
    total_shortage_value = float(result_df['Shortage_Value'].sum())

    return {
        "status": "SUCCESS",
        "summary": {
            "overstock_count": overstock_count,
            "understock_count": understock_count,
            "slow_moving_count": slow_moving_count,
            "total_excess_value": total_excess_value,
            "total_shortage_value": total_shortage_value,
        },
        "data": result_df.to_dict(orient="records")
    }


# =====================================================================
# RUTE POST / PUT (FONDASI INTEGRASI FRONTEND)
# =====================================================================

# ---------------------------------------------------------------------
# AUTHENTICATION: Login via Employee ID + Password
# ---------------------------------------------------------------------
@app.post("/api/v1/auth/login", tags=["Authentication"])
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Cari user berdasarkan employee_id
    user = db.query(User).filter(
        User.employee_id == req.operatorId
    ).first()
    
    if not user or user.password_hash != req.accessKey:
        raise HTTPException(status_code=401, detail="AUTHENTICATION FAILED: Invalid Operator ID or Access Key.")
    
    # Update status jaringan jadi ACTIVE saat berhasil login
    user.network_status = "ACTIVE"
    db.commit()
    db.refresh(user)
    
    # JOIN ke tabel roles untuk mendapatkan role_name ("manager", "engineer", dll)
    role = db.query(Role).filter(Role.id == user.role_id).first()
    role_name_raw = role.role_name.lower() if role else "engineer"
    
    # Normalisasi nama role
    if "engineering" in role_name_raw:
        role_name = "engineer"
    elif "procurement" in role_name_raw:
        role_name = "procurement"
    elif "manager" in role_name_raw or "admin" in role_name_raw:
        role_name = "manager"
    else:
        role_name = "engineer"


    # Mapping avatar default berdasarkan role
    avatar_map = {
        "manager": "/images/avatar/manager.png",
        "procurement": "/images/avatar/procurement.png",
        "engineer": "/images/avatar/engineer.png",
    }
    
    # Kembalikan objek User LENGKAP sesuai format yang diharapkan frontend
    return {
        "id": str(user.id),
        "employeeId": user.employee_id,
        "fullName": user.full_name,
        "email": user.email or f"{user.full_name.lower().replace(' ', '.')}@toolcrib.ai",
        "phone": "",
        "role": role_name,
        "department": user.department_shift or "General",
        "position": role_name.capitalize(),
        "avatar": avatar_map.get(role_name, "/images/avatar/engineer.png"),
        "status": "active",
        "createdAt": str(user.created_at.date()) if user.created_at else "",
        "updatedAt": str(user.created_at.date()) if user.created_at else "",
    }


# ---------------------------------------------------------------------
# AUTHENTICATION: Logout via Employee ID
# ---------------------------------------------------------------------
@app.post("/api/v1/auth/logout", tags=["Authentication"])
def logout(req: LoginRequest, db: Session = Depends(get_db)):
    # Kita bisa menggunakan struktur req yang sama untuk mengirim operatorId
    user = db.query(User).filter(User.employee_id == req.operatorId).first()
    if user:
        user.network_status = "OFFLINE"
        db.commit()
    return {"status": "SUCCESS", "message": "User logged out safely"}

# ---------------------------------------------------------------------
# SPARE PARTS: Tambah barang baru ke gudang
# ---------------------------------------------------------------------
@app.post("/api/v1/spare-parts", tags=["Warehouse & AI"])
def create_sparepart(data: SparePartCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(SparePart).filter(SparePart.sku == data.sku).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"SKU {data.sku} already exists.")
            
        new_part = SparePart(
            sku=data.sku,
            part_name=data.part_name,
            category=data.category,
            current_stock=data.current_stock,
            min_stock=data.min_stock,
            max_stock=data.max_stock,
            unit_price=data.unit_price,
            criticality_level=data.criticality_level,
            rack_location=data.rack_location
        )
        db.add(new_part)
        db.commit()
        db.refresh(new_part)
        return {"status": "SUCCESS", "data": new_part}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/v1/spare-parts/{sku}", tags=["Warehouse & AI"])
def delete_sparepart(sku: str, db: Session = Depends(get_db)):
    part = db.query(SparePart).filter(SparePart.sku == sku).first()
    if not part:
        raise HTTPException(status_code=404, detail="Spare part not found")
    
    db.delete(part)
    db.commit()
    return {"status": "SUCCESS", "message": f"Deleted SKU {sku}"}


# ---------------------------------------------------------------------
# MACHINES: Registrasi mesin baru
# ---------------------------------------------------------------------
@app.post("/api/v1/machines", tags=["Factory Floor"])
def create_machine(data: MachineCreate, db: Session = Depends(get_db)):
    existing = db.query(Machine).filter(Machine.machine_id == data.machine_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Machine {data.machine_id} already exists.")
        
    new_machine = Machine(
        machine_id=data.machine_id,
        machine_name=data.machine_name,
        required_spare_parts=data.required_spare_parts,
        last_maintenance_date=data.last_maintenance_date,
    )
    db.add(new_machine)
    db.commit()
    db.refresh(new_machine)
    return {"status": "SUCCESS", "data": new_machine}

@app.delete("/api/v1/machines/{machine_id}", tags=["Factory Floor"])
def delete_machine(machine_id: str, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.machine_id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    
    db.delete(machine)
    db.commit()
    return {"status": "SUCCESS", "message": f"Deleted machine {machine_id}"}


# ---------------------------------------------------------------------
# REQUESTS: Buat request spare part baru
# ---------------------------------------------------------------------
@app.post("/api/v1/requests", tags=["Approval Bureaucracy"])
def create_request(data: RequestCreate, db: Session = Depends(get_db)):
    # Validasi Mesin
    machine = db.query(Machine).filter(Machine.machine_id == data.machine_id).first()
    if not machine:
        raise HTTPException(status_code=400, detail="Invalid Machine ID")
        
    # Validasi bahwa semua SKU valid
    if not data.items:
        raise HTTPException(status_code=400, detail="Keranjang barang tidak boleh kosong!")
    for item in data.items:
        part = db.query(SparePart).filter(SparePart.sku == item.sku).first()
        if not part:
            raise HTTPException(status_code=400, detail=f"Invalid SKU: {item.sku}")
        
    # Ambil user admin/default untuk requestor
    default_user = db.query(User).first()
    if not default_user:
        raise HTTPException(status_code=500, detail="Database users is empty")
        
    new_req_id = f"REQ-{uuid.uuid4().hex[:6].upper()}"
    new_request = SparepartRequest(
        request_id=new_req_id,
        requestor_id=default_user.id,
        machine_id=data.machine_id,
        document_url=data.document_url,
        approval_status="PENDING",
        request_type=data.request_type,
        urgency=data.urgency
    )
    db.add(new_request)
    
    # Simpan rincian barang
    for item in data.items:
        new_item = SparepartRequestItem(
            request_id=new_req_id,
            sku=item.sku,
            quantity=item.quantity
        )
        db.add(new_item)

    db.commit()
    db.refresh(new_request)
    return {"status": "SUCCESS", "data": {"request_id": new_req_id, "total_items": len(data.items)}}


# ---------------------------------------------------------------------
# REQUESTS: Update status approval (APPROVE / REJECT / DELIVER)
# ---------------------------------------------------------------------
@app.put("/api/v1/requests/{request_id}/status", tags=["Approval Bureaucracy"])
def update_request_status(request_id: str, data: RequestStatusUpdate, db: Session = Depends(get_db)):
    req = db.query(SparepartRequest).filter(SparepartRequest.request_id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    req.approval_status = data.approval_status
    
    # [NEW LOGIC] - Auto Restock / Consume & AI Transaction Logging untuk semua item
    if data.approval_status in ["DONE", "DELIVERED", "APPROVED"]:
        items = db.query(SparepartRequestItem).filter(SparepartRequestItem.request_id == request_id).all()
        for item in items:
            part = db.query(SparePart).filter(SparePart.sku == item.sku).first()
            if part:
                if req.request_type == "PROCUREMENT":
                    # Minta barang ke vendor (tambah stok)
                    part.current_stock += item.quantity
                    trx_type = "IN"
                    notes = f"Restocked from Procurement Request {request_id}"
                else:
                    # Ambil barang dari gudang (kurangi stok)
                    part.current_stock -= item.quantity
                    trx_type = "OUT"
                    notes = f"Consumed by Request {request_id} for Machine {req.machine_id}"

                # Buat log transaksi untuk AI
                trx = InventoryTransaction(
                    transaction_type=trx_type,
                    quantity=item.quantity,
                    notes=notes,
                    sku=item.sku,
                    user_id=req.requestor_id
                )
                db.add(trx)
            
    db.commit()
    db.refresh(req)
    return {"status": "SUCCESS", "data": req.request_id}