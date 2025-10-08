from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///department.db'
db = SQLAlchemy(app)

# @app.route("/")
# def login_page():
#     return render_template('login.html')

@app.route("/")
@app.route('/adminDashboard')
def admin_dashboard():
    departments = Department.query.all()
    issues = Issue.query.order_by(Issue.created_at.desc()).limit(10).all()
    total_issues= Issue.query.count()
    resolved_issues = Issue.query.filter_by(status = "Resolved").count()
    pending_issues = Issue.query.filter_by(status = "Pending").count()
    in_progress_issues = Issue.query.filter_by(status = "In Progress").count()
    return render_template('adminDashboard.html', departments=departments,
        issues=issues,
        total_issues=total_issues,
        resolved_issues=resolved_issues,
        pending_issues=pending_issues,
        in_progress_issues=in_progress_issues)


# Database Models

class Department(db.Model):
    __tablename__ = "departments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    phone = db.Column(db.String(15), nullable=False, unique=True)

    # Relationship with issues
    issues = db.relationship("Issue", backref="department", lazy=True)

    def __repr__(self):
        return f"<Department {self.name}>"
    
    
class Issue(db.Model):
    __tablename__ = "issues"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(20), nullable=False, default="Pending")  # Pending, In Progress, Resolved

    dept_id = db.Column(db.Integer, db.ForeignKey("departments.id"), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Issue {self.title} - {self.status}>"

    
@app.route("/reports")
def reports_page():
    return render_template("Map.html")


@app.route("/api/issues")
def get_all_issues():
    issues = Issue.query.all()
    issues_list = []
    for issue in issues:
        dept_name = issue.department.name if issue.department else "Unknown"
        issues_list.append({
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "lat": issue.latitude,
            "lng": issue.longitude,
            "status": issue.status,
            "department": dept_name
        })
    return jsonify(issues_list)






@app.route("/api/stats")
def api_stats():
    total = Issue.query.count()
    pending = Issue.query.filter_by(status="Pending").count()
    in_progress = Issue.query.filter_by(status="In Progress").count()
    resolved = Issue.query.filter_by(status="Resolved").count()

    # Issues grouped by department name
    dept_counts = (
        db.session.query(Department.name, func.count(Issue.id))
        .outerjoin(Issue, Department.id == Issue.dept_id)
        .group_by(Department.name)
        .all()
    )

    return jsonify({
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "by_department": [
            {"department": dept, "count": count} for dept, count in dept_counts
        ]
    })


@app.route("/api/issues")
def api_issues():
    issues = Issue.query.order_by(Issue.created_at.desc()).all()
    return jsonify([
        {
            "id": issue.id,
            "title": issue.title,
            "status": issue.status,
            "department": issue.department.name if issue.department else "Unknown",
            "created_at": issue.created_at.isoformat() if issue.created_at else None
        }
        for issue in issues
    ])



@app.route("/department/<string:dept_name>")
def department_page(dept_name):
    # Fetch department by name (case-sensitive by default)
    department = Department.query.filter_by(name=dept_name).first_or_404()
    return render_template("departmentalDashboard.html", department=department)


if __name__ == "__main__":
    app.run(debug=True)