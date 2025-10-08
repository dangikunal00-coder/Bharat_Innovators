from app import db, Department, Issue
from app import app

with app.app_context():
    # Drop and recreate tables
    db.drop_all()
    db.create_all()

    # ----- Departments -----
    dept1 = Department(name="Roads & Transport", email="roads@civic.gov.in", phone="9876543210")
    dept2 = Department(name="Water Supply", email="water@civic.gov.in", phone="9123456780")
    dept3 = Department(name="Waste Management", email="waste@civic.gov.in", phone="9988776655")
    dept4 = Department(name="Street Lighting", email="lighting@civic.gov.in", phone="9090909090")
    db.session.add_all([dept1, dept2, dept3, dept4])
    db.session.commit()

    # ----- Issues with coordinates -----
    issues = [
        Issue(title="Pothole on Main Road", description="Large pothole causing traffic congestion.",
              latitude=28.6139, longitude=77.2090, status="Pending", dept_id=dept1.id),
        Issue(title="Water Leakage", description="Leakage in main supply pipeline.",
              latitude=28.6200, longitude=77.2100, status="In Progress", dept_id=dept2.id),
        Issue(title="Garbage Not Collected", description="Garbage pile-up for 3 days.",
              latitude=28.6250, longitude=77.2150, status="Pending", dept_id=dept3.id),
        Issue(title="Street Light Not Working", description="Lamp post near park is broken.",
              latitude=28.6300, longitude=77.2200, status="Resolved", dept_id=dept4.id),
    ]

    db.session.add_all(issues)
    db.session.commit()
    print("✅ Database seeded successfully!")


