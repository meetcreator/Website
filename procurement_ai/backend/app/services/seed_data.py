# file: backend/app/services/seed_data.py
import json
import random
import os
from datetime import datetime, timedelta

# Major GIDC industrial clusters & SME vendors
VENDORS = [
    {"name": "Radhe Steel Industries", "phone": "+919825012345", "category": "Steel Plates", "city": "Naroda GIDC", "reliability": 84.50, "avg_delay": 1.2, "late_pct": 11.5},
    {"name": "Morbi Ceramic Glazes", "phone": "+919904098765", "category": "Glaze Materials", "city": "Morbi Ceramics Zone", "reliability": 72.00, "avg_delay": 2.4, "late_pct": 18.0},
    {"name": "Ankleshwar Solvent Corp", "phone": "+919876054321", "category": "Chemicals", "city": "Ankleshwar GIDC", "reliability": 91.20, "avg_delay": 0.5, "late_pct": 5.4},
    {"name": "Vatva Polymer Compounds", "phone": "+919426011223", "category": "Plastics", "city": "Vatva GIDC", "reliability": 65.80, "avg_delay": 3.1, "late_pct": 24.5},
    {"name": "Saurashtra Forging Works", "phone": "+919979055667", "category": "Forgings", "city": "Rajkot Shapar", "reliability": 78.40, "avg_delay": 1.8, "late_pct": 14.0},
    {"name": "Somnath Bolt & Fasteners", "phone": "+919898022334", "category": "Fasteners", "city": "Metoda GIDC", "reliability": 95.00, "avg_delay": 0.2, "late_pct": 2.1},
    {"name": "Gujarat Packaging Systems", "phone": "+919409055443", "category": "Packaging", "city": "Sachin GIDC", "reliability": 88.00, "avg_delay": 0.8, "late_pct": 8.0},
    {"name": "Ambika Castings & Alloys", "phone": "+919712033445", "category": "Casting Parts", "city": "Odhav GIDC", "reliability": 60.50, "avg_delay": 4.2, "late_pct": 31.2},
    {"name": "Narmada Chemical Refinery", "phone": "+919824077889", "category": "Solvents", "city": "Dahej GIDC", "reliability": 89.50, "avg_delay": 0.9, "late_pct": 7.5},
    {"name": "Dwarkesh Forged Flanges", "phone": "+919925066778", "category": "Pipes & Flanges", "city": "Moraiya GIDC", "reliability": 82.00, "avg_delay": 1.4, "late_pct": 12.0}
]

ITEMS = {
    "Steel Plates": ["Mild Steel Plates 12mm", "Stainless Steel Sheets 304", "Galvanized Iron Sheets", "MS Angles 50x50"],
    "Glaze Materials": ["Zirconium Opacifier", "Frit Powder Grade A", "Barium Carbonate", "Zinc Oxide Calcined"],
    "Chemicals": ["Ethyl Acetate Drums", "Toluene Solvents", "Caustic Soda Flakes", "Hydrochloric Acid 33%"],
    "Plastics": ["HDPE Granules Blue", "PVC Resin K-67", "Polypropylene Copolymer", "LDPE Masterbatches"],
    "Forgings": ["Forged Steel Rings", "C45 Shaft Blanks", "Connecting Rod forgings", "Die Blocks H13"],
    "Fasteners": ["Hex Bolts M16x80", "Socket Cap Screws M8", "Anchor Fasteners 12mm", "Spring Washers"],
    "Packaging": ["Corrugated Boxes 5-Ply", "HDPE Woven Bags 50kg", "Stretch Wrap Rolls", "Wooden Pallets Heavy"],
    "Casting Parts": ["Grey Iron Cast Housing", "SG Iron Gears", "Brass Valve castings", "Aluminum Cast Flanges"],
    "Solvents": ["Isopropyl Alcohol", "Methanol Industrial", "Acetone Pure", "Xylene Refined"],
    "Pipes & Flanges": ["Seamless Carbon Steel Pipes", "SS Flanges Class 150", "Forged Flanges ANSI B16", "Elbow Joint 90 Deg"]
}

# Downstream production consequences matched by category
IMPACT_TEMPLATES = {
    "Steel Plates": [
        "Stops CNC laser cutting floor B by {hr} hours",
        "Delays structural welding fabrication bay 1 by {hr} hours",
        "Assembly Line A blocked, delaying {qty} final shipments"
    ],
    "Glaze Materials": [
        "Kiln firing Line #3 delayed. Prevents ceramic glazing.",
        "Halts Morbi glazing tank assembly by {hr} hours",
        "Stops automated tile pressing loop B"
    ],
    "Chemicals": [
        "Solvent synthesis reactor #2 holding. Line down by {hr} hours.",
        "Prevents formulation of polymer mixing batch #14",
        "Delays packaging of chemical exports by {hr} hours"
    ],
    "Plastics": [
        "Injection molding machine B running dry in {hr} hours",
        "Extrusion line #4 stops. Blow molding delayed.",
        "Halts plastic pallet casing fabrication"
    ],
    "Forgings": [
        "CNC machining spindle A idle. Blocks axle assembly.",
        "Forging heat treatment queue holding by {hr} hours",
        "Stops gear-cutting operations for Shapar lathe floor"
    ],
    "Fasteners": [
        "Minor routine assembly impact. Non-blocking.",
        "Blocks bracket structural casing. Line down in {hr} hours.",
        "Packaging box sealing loop holding"
    ],
    "Packaging": [
        "Finished stock container packaging delayed. Shipping risk.",
        "Carton boxes stockout. Dispatch bay holding by {hr} hours.",
        "Pallet wrapping line bottlenecked"
    ],
    "Casting Parts": [
        "Housing assembly blocked, halts hydraulic line B.",
        "SG casting grinding line idle. Delays CNC operations.",
        "Cast valve assembly floor down by {hr} hours"
    ],
    "Solvents": [
        "Reactor wash cycle delayed by {hr} hours",
        "Chemical blending line C holding. Safety wash delay.",
        "Export container customs packaging risk"
    ],
    "Pipes & Flanges": [
        "Seamless boiler pipeline installation blocked",
        "High pressure steam testing line down by {hr} hours",
        "Manifold flange coupling welding delayed"
    ]
}

def generate_gstin(state_code="24"):
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    nums = "0123456789"
    pan = "".join(random.choices(chars, k=5)) + "".join(random.choices(nums, k=4)) + "".join(random.choices(chars, k=1))
    return f"{state_code}{pan}1Z5"

def seed_procurement_data(count=500):
    start_date = datetime.now() - timedelta(days=90)
    data = []
    
    # Realistic operational state distribution
    state_choices = (
        ["CREATED"] * 40 +
        ["RFQ_SENT"] * 30 +
        ["VENDOR_PENDING"] * 80 +
        ["ETA_RECEIVED"] * 80 +
        ["APPROVAL_PENDING"] * 50 +
        ["APPROVED"] * 60 +
        ["IN_TRANSIT"] * 60 +
        ["DELAYED"] * 40 +
        ["ESCALATED"] * 10 +
        ["COMPLETED"] * 40 +
        ["CANCELLED"] * 10
    )
    
    # Priority weighting
    priority_choices = (
        ["CRITICAL"] * 10 +   # 10% highest urgency
        ["HIGH"] * 25 +       # 25% shipping risk
        ["NORMAL"] * 50 +     # 50% routine
        ["LOW"] * 15          # 15% non-blocking
    )
    
    for i in range(1, count + 1):
        vendor = random.choice(VENDORS)
        po_num = f"PO-2026-{1000 + i}"
        days_offset = random.randint(0, 85)
        po_date = start_date + timedelta(days=days_offset)
        
        status = random.choice(state_choices)
        priority = random.choice(priority_choices)
        
        # Override priorities based on status to model real escalations
        if status == "ESCALATED":
            priority = random.choice(["CRITICAL", "HIGH"])
        elif status == "DELAYED" and random.choice([True, False]):
            priority = "HIGH"
            
        # Create items
        cat = vendor["category"]
        possible_items = ITEMS.get(cat, ["Industrial Raw Materials"])
        num_items = random.randint(1, 3)
        items_chosen = random.sample(possible_items, k=min(num_items, len(possible_items)))
        
        items_payload = []
        for it in items_chosen:
            qty = random.randint(20, 4000)
            price = round(random.uniform(80, 2000), 2)
            items_payload.append({
                "item_description": it,
                "quantity": qty,
                "unit_price": price,
                "total_amount": round(qty * price, 2),
                "hsn_code": "".join(random.choices("0123456789", k=8))
            })
            
        amount = sum(x["total_amount"] for x in items_payload)
        
        original_eta = po_date + timedelta(days=random.randint(5, 18))
        revised_eta = None
        
        if status in ["DELAYED", "ESCALATED"]:
            revised_eta = original_eta + timedelta(days=random.randint(3, 12))
        elif status == "APPROVAL_PENDING" and random.choice([True, False]):
            revised_eta = original_eta + timedelta(days=random.randint(4, 6))

        coordination_friction = 0
        if status in ["DELAYED", "ESCALATED", "APPROVAL_PENDING"]:
            coordination_friction = random.randint(7200, 86400 * 4)
            
        # Production Impact mapping (Priority 2)
        impact = "Routine material procurement. Non-blocking."
        if priority in ["CRITICAL", "HIGH", "NORMAL"] and status in ["DELAYED", "ESCALATED", "APPROVAL_PENDING", "VENDOR_PENDING"]:
            templates = IMPACT_TEMPLATES.get(cat, ["Delays downline assembly floor"])
            raw_temp = random.choice(templates)
            impact = raw_temp.format(
                hr=random.choice([4, 6, 8, 12, 16, 24]),
                qty=random.randint(100, 1500)
            )
            
        task = {
            "id": i,
            "po_number": po_num,
            "po_date": po_date.strftime("%Y-%m-%d"),
            "vendor_name": vendor["name"],
            "vendor_phone": vendor["phone"],
            "category": cat,
            "industrial_zone": vendor["city"],
            "vendor_gstin": generate_gstin(),
            "status": status,
            
            # Phase C Fields
            "priority": priority,
            "production_impact": impact,
            
            # Vendor Scorecard Details (Priority 3)
            "vendor_reliability_score": vendor["reliability"],
            "vendor_avg_delay_days": vendor["avg_delay"],
            "vendor_late_deliveries_pct": vendor["late_pct"],
            
            "total_amount": round(amount, 2),
            "original_eta": original_eta.strftime("%Y-%m-%d"),
            "revised_eta": revised_eta.strftime("%Y-%m-%d") if revised_eta else None,
            "items": items_payload,
            "coordination_friction_sec": coordination_friction,
            "escalation_level": random.randint(1, 3) if status == "ESCALATED" else 0,
            "metadata": {
                "gst_rate": random.choice([12, 18, 28]),
                "payment_terms": random.choice(["30 Days Credit", "50% Advance", "90 Days LC"]),
                "freight_charges": random.choice(["Paid by Supplier", "To Pay at Destination"])
            }
        }
        
        data.append(task)
        
    target_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../frontend/mock_500_tasks.json"))
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    
    with open(target_path, "w") as f:
        json.dump(data, f, indent=2)
        
    print(f"Successfully updated 500 fake SME procurement records with Phase C stats at: {target_path}")
    return count

if __name__ == "__main__":
    seed_procurement_data(500)
