from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

# -------------------------------------------------------------------
# 1. AUTHENTICATION SCHEMAS
# -------------------------------------------------------------------
class LoginRequest(BaseModel):
    operatorId: str  # Frontend mengirimkan operatorId (employee_id)
    accessKey: str   # Frontend mengirimkan accessKey (password)


# -------------------------------------------------------------------
# 2. SPARE PART / INVENTORY SCHEMAS
# -------------------------------------------------------------------
class SparePartCreate(BaseModel):
    sku: str
    part_name: str
    category: Optional[str] = "General"
    current_stock: int
    min_stock: Optional[int] = 5
    max_stock: Optional[int] = 100
    criticality_level: Optional[str] = "LOW"
    rack_location: Optional[str] = "A1-01"
    unit_price: Optional[float] = 0.0

class SparePartResponse(BaseModel):
    sku: str
    part_name: str
    category: str
    current_stock: int
    
    class Config:
        from_attributes = True


# -------------------------------------------------------------------
# 3. MACHINERY SCHEMAS
# -------------------------------------------------------------------
class MachineCreate(BaseModel):
    machine_id: str
    machine_name: str
    required_spare_parts: List[str]
    last_maintenance_date: date

class MachineResponse(BaseModel):
    machine_id: str
    machine_name: str
    required_spare_parts: List[str]
    last_maintenance_date: Optional[date]
    standard_schedule_date: Optional[date]
    ai_prediction_date: Optional[date]
    status: str

    class Config:
        from_attributes = True


# -------------------------------------------------------------------
# 4. REQUEST SCHEMAS
# -------------------------------------------------------------------
class RequestCreate(BaseModel):
    sku: str
    machine_id: str
    quantity: int
    document_url: Optional[str] = None

class RequestStatusUpdate(BaseModel):
    approval_status: str  # PENDING, APPROVED, REJECTED, PURCHASING, DELIVERED


# -------------------------------------------------------------------
# 5. USER SCHEMAS
# -------------------------------------------------------------------
class UserCreate(BaseModel):
    employee_id: str
    full_name: str
    password_hash: str
    role_id: int
    department_shift: Optional[str] = None
    email: Optional[str] = None
    network_status: Optional[str] = "OFFLINE"
