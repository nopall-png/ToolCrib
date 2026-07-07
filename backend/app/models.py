import uuid
from sqlalchemy import Column, BigInteger, String, Text, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

# ==========================================
# 1. TABEL MASTER HAK AKSES
# ==========================================
class Role(Base):
    __tablename__ = "roles"

    id = Column(BigInteger, primary_key=True, index=True)
    role_name = Column(String, unique=True, nullable=False)

    users = relationship("User", back_populates="role")


# ==========================================
# 2. TABEL PEGAWAI PABRIK
# ==========================================
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    employee_id = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    department_shift = Column(String, nullable=True)
    email = Column(String, nullable=True)
    network_status = Column(String, server_default="OFFLINE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign Keys
    role_id = Column(BigInteger, ForeignKey("roles.id"), nullable=False)

    # Relationships
    role = relationship("Role", back_populates="users")


# ==========================================
# 3. TABEL VENDOR (SUPPLIER)
# ==========================================
class Vendor(Base):
    __tablename__ = "vendors"

    vendor_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    vendor_name = Column(String, nullable=False)
    rating = Column(Numeric(3, 1), server_default="5.0")
    contact_email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ==========================================
# 4. TABEL GUDANG MASTER & OTAK AI
# ==========================================
class SparePart(Base):
    __tablename__ = "spare_parts"

    sku = Column(String, primary_key=True, index=True)
    part_name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    current_stock = Column(BigInteger, server_default="0")
    min_stock = Column(BigInteger, nullable=True)
    max_stock = Column(BigInteger, nullable=True)
    unit_price = Column(Numeric(12, 2), nullable=True)
    criticality_level = Column(String, nullable=True)
    rack_location = Column(String, nullable=True)
    specifications = Column(JSONB, nullable=True) # Nyawa vektor ChromaDB
    lead_time_days = Column(BigInteger, server_default="14")
    primary_vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.vendor_id"), nullable=True)
    
    vendor = relationship("Vendor")


# ==========================================
# 5. TABEL LOG/CCTV TRANSAKSI GUDANG
# ==========================================
class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    transaction_type = Column(String, nullable=False) # 'IN' atau 'OUT'
    quantity = Column(BigInteger, nullable=False)
    notes = Column(Text, nullable=True)
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign Keys
    sku = Column(String, ForeignKey("spare_parts.sku"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)


# ==========================================
# 6. TABEL KATALOG MESIN PABRIK
# ==========================================
class Machine(Base):
    __tablename__ = "machines"

    machine_id = Column(String, primary_key=True, index=True)
    machine_name = Column(String, nullable=False)
    required_spare_parts = Column(JSONB, nullable=True)
    last_maintenance_date = Column(Date, nullable=True)
    standard_schedule_date = Column(Date, nullable=True)
    ai_prediction_date = Column(Date, nullable=True) # Diupdate otomatis oleh AI
    status = Column(String, server_default="HEALTHY")
    downtime_impact = Column(String, server_default="MEDIUM")


# ==========================================
# 7. TABEL KERANJANG REQUEST APPROVAL
# ==========================================
class SparepartRequest(Base):
    __tablename__ = "sparepart_requests"

    request_id = Column(String, primary_key=True, index=True)
    urgency = Column(String, server_default="NORMAL")
    document_url = Column(String, nullable=True)
    approval_status = Column(String, server_default="PENDING")
    request_type = Column(String, server_default="TAKE") # 'TAKE' atau 'PROCUREMENT'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign Keys
    requestor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    machine_id = Column(String, ForeignKey("machines.machine_id"), nullable=False)

    # Relationships
    items = relationship("SparepartRequestItem", back_populates="request", cascade="all, delete-orphan")

class SparepartRequestItem(Base):
    __tablename__ = "sparepart_request_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    request_id = Column(String, ForeignKey("sparepart_requests.request_id", ondelete="CASCADE"), nullable=False)
    sku = Column(String, ForeignKey("spare_parts.sku", ondelete="CASCADE"), nullable=False)
    quantity = Column(BigInteger, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    request = relationship("SparepartRequest", back_populates="items")
    spare_part = relationship("SparePart")