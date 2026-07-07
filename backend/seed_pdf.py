import os
import sys
import uuid
import random
from datetime import datetime, timedelta
import pdfplumber
import json
from sqlalchemy.orm import Session
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import SparePart, Vendor, Machine, InventoryTransaction, SparepartRequest, SparepartRequestItem, User, Role

PDF_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "PT_Mattel_ToolCrib_Dataset.pdf")
PDF_PATH = os.path.abspath(PDF_PATH)

def clear_data(db: Session):
    print("🧹 Wiping old data...")
    db.execute(text("TRUNCATE TABLE inventory_transactions CASCADE;"))
    db.execute(text("TRUNCATE TABLE sparepart_request_items CASCADE;"))
    db.execute(text("TRUNCATE TABLE sparepart_requests CASCADE;"))
    db.execute(text("TRUNCATE TABLE spare_parts CASCADE;"))
    db.execute(text("TRUNCATE TABLE vendors CASCADE;"))
    db.execute(text("TRUNCATE TABLE machines CASCADE;"))
    db.commit()
    print("✅ Database wiped cleanly (Users untouched).")

def parse_pdf_and_seed(db: Session):
    print(f"📖 Reading PDF: {PDF_PATH}")
    
    vendors_cache = {} 
    
    with pdfplumber.open(PDF_PATH) as pdf:
        num_pages = len(pdf.pages)
        print(f"📄 Found {num_pages} pages in PDF.")
        
        # Parse Tools (Pages 1 to 200, which is index 1 to 200)
        tools_parsed = 0
        for i in range(1, 201):
            if i >= num_pages:
                break
                
            page = pdf.pages[i]
            table = page.extract_table()
            if not table:
                continue
            
            data = {}
            for row in table:
                if len(row) >= 2 and row[0]:
                    key = str(row[0]).replace("\n", " ").strip()
                    val = str(row[1]).replace("\n", " ").strip() if row[1] else ""
                    data[key] = val
                    
            sku = data.get("SKU")
            if not sku:
                continue
                
            vendor_name = data.get("Supplier", "Unknown Supplier")
            vendor_email = data.get("Supplier Email", "info@example.com")
            
            try:
                vendor_rating = float(data.get("Supplier Rating", "4.5"))
            except ValueError:
                vendor_rating = 4.5
            
            if vendor_email not in vendors_cache:
                new_vendor = Vendor(
                    vendor_id=uuid.uuid4(),
                    vendor_name=vendor_name,
                    rating=vendor_rating,
                    contact_email=vendor_email
                )
                db.add(new_vendor)
                db.commit() 
                vendors_cache[vendor_email] = new_vendor.vendor_id
                
            vendor_id = vendors_cache[vendor_email]
            
            try:
                price_str = data.get("Unit Price", "0").replace("Rp", "").replace(",", "").replace(".", "").strip()
                unit_price = float(price_str)
            except ValueError:
                unit_price = 0.0
                
            try:
                lead_time = int(data.get("Lead Time (Days)", "14").split()[0])
            except ValueError:
                lead_time = 14
                
            try:
                stock_qty = int(data.get("Stock Quantity", "0").split()[0])
            except ValueError:
                stock_qty = 0
                
            try:
                min_stock = int(data.get("Minimum Stock", "10").split()[0])
            except ValueError:
                min_stock = 10
                
            try:
                max_stock = int(data.get("Maximum Stock", "100").split()[0])
            except ValueError:
                max_stock = 100
            
            specs = {
                "Brand": data.get("Brand"),
                "Model": data.get("Model"),
                "Part Number": data.get("Part Number"),
                "Material": data.get("Material"),
                "Dimension": data.get("Dimension"),
                "Weight": data.get("Weight"),
                "Technical Specification": data.get("Technical Specification"),
            }
            
            part = SparePart(
                sku=sku,
                part_name=data.get("Item Name", sku),
                category=data.get("Category", "UNCATEGORIZED"),
                current_stock=stock_qty,
                min_stock=min_stock,
                max_stock=max_stock,
                unit_price=unit_price,
                criticality_level="MEDIUM",
                rack_location=f"{data.get('Rack', 'R-1')} {data.get('Bin', 'B-1')}",
                specifications=specs,
                lead_time_days=lead_time,
                primary_vendor_id=vendor_id
            )
            db.add(part)
            tools_parsed += 1
            
            if tools_parsed % 50 == 0:
                print(f"   Seeded {tools_parsed} tools...")
                
        db.commit()
        print(f"✅ Finished seeding {tools_parsed} Tools and their Vendors!")

        # Parse Machines (Page 201 -> index 201)
        if num_pages > 201:
            machine_page = pdf.pages[201]
            machine_table = machine_page.extract_table()
            machines_parsed = 0
            if machine_table:
                # Ensure it skips header (row 0)
                for row in machine_table[1:]:
                    if len(row) >= 5 and row[0]:
                        machine_id = str(row[0]).strip()
                        machine_name = str(row[1]).replace("\n", " ").strip()
                        downtime_impact = str(row[2]).strip()
                        status = str(row[3]).strip()
                        
                        req_parts_str = str(row[4]).replace("\n", " ")
                        if req_parts_str:
                            req_parts_list = [p.strip() for p in req_parts_str.split(",") if p.strip()]
                        else:
                            req_parts_list = []
                            
                        machine = Machine(
                            machine_id=machine_id,
                            machine_name=machine_name,
                            downtime_impact=downtime_impact,
                            status=status,
                            required_spare_parts=req_parts_list,
                            last_maintenance_date=datetime.now().date() - timedelta(days=random.randint(10, 100)),
                            standard_schedule_date=datetime.now().date() + timedelta(days=random.randint(10, 90)),
                            ai_prediction_date=None
                        )
                        db.add(machine)
                        machines_parsed += 1
                db.commit()
                print(f"✅ Finished seeding {machines_parsed} Machines!")
            else:
                print("⚠️ Machine table not found on page 202.")

def generate_transactions(db: Session):
    print("📈 Generating AI Fuel (Historical Transactions)...")
    parts = db.query(SparePart).all()
    if not parts:
        return
        
    user = db.query(User).first()
    if not user:
        role = db.query(Role).first()
        if not role:
            role = Role(role_name="SYSTEM")
            db.add(role)
            db.commit()
        user = User(employee_id="SYS-001", full_name="System Generated", password_hash="dummy", role_id=role.id)
        db.add(user)
        db.commit()
        
    user_id = user.id
    end_date = datetime.now()
    
    total_trxs = 0
    for part in parts:
        # Number of transactions depends roughly on stock max to make sense
        num_trx = random.randint(10, 30)
        for _ in range(num_trx):
            random_days_ago = random.randint(0, 180)
            trx_date = end_date - timedelta(days=random_days_ago)
            
            qty = random.randint(1, 3)
            
            trx = InventoryTransaction(
                id=uuid.uuid4(),
                sku=part.sku,
                user_id=user_id,
                transaction_type="OUT",
                quantity=qty,
                transaction_date=trx_date,
                notes="Simulated AI data"
            )
            db.add(trx)
            total_trxs += 1
            
    db.commit()
    print(f"✅ Generated {total_trxs} historical transactions for AI Engine.")

def main():
    db = SessionLocal()
    try:
        clear_data(db)
        parse_pdf_and_seed(db)
        generate_transactions(db)
        print("🎉 All database wipe and seed operations completed successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
