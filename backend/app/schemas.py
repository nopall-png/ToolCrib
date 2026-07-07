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
# 1.5 VENDOR SCHEMAS
# -------------------------------------------------------------------
class VendorCreate(BaseModel):
    vendor_name: str
    contact_email: Optional[str] = None
    rating: Optional[float] = 5.0

class VendorResponse(VendorCreate):
    vendor_id: str
    
    class Config:
        from_attributes = True

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
    lead_time_days: Optional[int] = 14
    primary_vendor_id: Optional[str] = None

class SparePartResponse(BaseModel):
    sku: str
    part_name: str
    category: str
    current_stock: int
    lead_time_days: int
    primary_vendor_id: Optional[str] = None
    
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
    downtime_impact: Optional[str] = "MEDIUM"

class MachineResponse(BaseModel):
    machine_id: str
    machine_name: str
    required_spare_parts: List[str]
    last_maintenance_date: Optional[date]
    standard_schedule_date: Optional[date]
    ai_prediction_date: Optional[date]
    status: str
    downtime_impact: str

    class Config:
        from_attributes = True


# -------------------------------------------------------------------
# 4. REQUEST SCHEMAS
# -------------------------------------------------------------------
class RequestItemBase(BaseModel):
    sku: str
    quantity: int

class RequestCreate(BaseModel):
    items: List[RequestItemBase]
    machine_id: str
    document_url: Optional[str] = None
    request_type: Optional[str] = "TAKE"
    urgency: Optional[str] = "NORMAL"

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
