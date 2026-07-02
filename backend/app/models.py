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
# 3. TABEL GUDANG MASTER & OTAK AI
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


# ==========================================
# 4. TABEL LOG/CCTV TRANSAKSI GUDANG
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
# 5. TABEL KATALOG MESIN PABRIK
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


# ==========================================
# 6. TABEL KERANJANG REQUEST APPROVAL
# ==========================================
class SparepartRequest(Base):
    __tablename__ = "sparepart_requests"

    request_id = Column(String, primary_key=True, index=True)
    quantity = Column(BigInteger, nullable=False)
    urgency = Column(String, server_default="NORMAL")
    document_url = Column(String, nullable=True)
    approval_status = Column(String, server_default="PENDING")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign Keys Raksasa (3 Sekaligus)
    requestor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    sku = Column(String, ForeignKey("spare_parts.sku"), nullable=False)
    machine_id = Column(String, ForeignKey("machines.machine_id"), nullable=False)