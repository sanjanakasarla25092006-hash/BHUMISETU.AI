
import os
from fpdf import FPDF

manuals = [
    "Platform Overview Guide", "Researcher Data Access Manual", "GIS Layer Navigation", "Policy Simulation Handbook",
    "AI Research Assistant Guide", "Evidence Hub Walkthrough", "Uploading Department Datasets", "Collaboration Module Basics",
    "Land Records API Integration", "Case Study Submission Guide"
]

if not os.path.exists("manuals"):
    os.makedirs("manuals")

class PDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 15)
        self.cell(0, 10, "BHUSETU - National Land Governance Platform", border=False, align="C")
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

for m in manuals:
    pdf = PDF()
    pdf.add_page()
    pdf.set_font("helvetica", "B", 16)
    pdf.cell(0, 10, m, ln=True)
    pdf.ln(10)
    pdf.set_font("helvetica", "", 12)
    
    content = f"""This is the official {m} for the BHUSETU platform.

1. Introduction
Welcome to the {m}. This document provides comprehensive guidelines and procedural steps for utilizing this specific module within the BHUSETU National Land Governance Platform.

2. Scope
This manual covers all features, workflows, and access requirements pertaining to {m}. Ensure you have the necessary role-based permissions (Researcher, Policymaker, or Department Admin) before attempting the steps outlined herein.

3. Key Guidelines
- Always verify your data sources before upload or analysis.
- Geospatial mapping layers should be cross-referenced with official state repositories.
- For API access, ensure your authentication tokens are kept secure.

4. Support
If you encounter any issues while following this {m}, please reach out to the technical support team via the HelpDesk portal.
"""
    pdf.multi_cell(0, 10, content)
    
    filename = m.replace(" ", "_") + ".pdf"
    pdf.output(f"manuals/{filename}")
print("PDFs generated successfully!")
