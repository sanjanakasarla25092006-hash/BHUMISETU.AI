
import os
import urllib.request
from fpdf import FPDF

# try to get emblem with User-Agent
if not os.path.exists("emblem.png"):
    try:
        req = urllib.request.Request("https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as response, open("emblem.png", "wb") as out_file:
            data = response.read()
            out_file.write(data)
    except Exception as e:
        print("Emblem error:", e)

try:
    from PIL import Image, ImageDraw, ImageFont
    if not os.path.exists("logo.png"):
        img = Image.new("RGBA", (200, 200), color=(255, 255, 255, 0))
        d = ImageDraw.Draw(img)
        d.ellipse([20, 20, 180, 180], fill=(27, 42, 65))
        img.save("logo.png")
except Exception as e:
    print("Logo error:", e)

class PDF(FPDF):
    def __init__(self, title):
        super().__init__()
        self.doc_title = title

    def header(self):
        if self.page_no() == 1:
            return

    def footer(self):
        if self.page_no() == 1:
            return
            
        self.set_y(-25)
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        
        self.set_y(-20)
        if os.path.exists("emblem.png"):
            self.image("emblem.png", 10, self.get_y(), 10)
            
        self.set_font("helvetica", "", 10)
        self.set_text_color(100, 100, 100)
        self.set_xy(25, self.get_y() + 3)
        self.cell(0, 5, "BhuSetu - National Land Governance Platform", border=0, align="L", new_x="LMARGIN", new_y="NEXT")
        
        if os.path.exists("logo.png"):
            self.image("logo.png", 180, self.get_y()-8, 12)
            
        self.set_xy(185, self.get_y() - 5)
        self.cell(0, 5, str(self.page_no()), border=0, align="R", new_x="LMARGIN", new_y="NEXT")

def make_pdf(title):
    pdf = PDF(title)
    pdf.set_auto_page_break(auto=True, margin=30)
    
    pdf.add_page()
    pdf.set_fill_color(46, 178, 235)
    pdf.rect(0, 0, 210, 297, "F")
    
    pdf.set_fill_color(255, 255, 255)
    pdf.rect(10, 0, 25, 30, "F")
    pdf.rect(175, 0, 25, 30, "F")
    
    if os.path.exists("emblem.png"):
        pdf.image("emblem.png", 12.5, 5, 20)
    if os.path.exists("logo.png"):
        pdf.image("logo.png", 177.5, 5, 20)
        
    pdf.set_fill_color(255, 255, 255)
    pdf.ellipse(100, 270, 200, 200, "F")
    
    pdf.set_xy(30, 120)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 32)
    pdf.multi_cell(150, 14, title, align="L")
    
    pdf.set_xy(30, 170)
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 6, "BhuSetu - National Land Governance Platform", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(30)
    pdf.set_font("helvetica", "", 10)
    pdf.cell(0, 6, "Official platform overview and usage guidelines", new_x="LMARGIN", new_y="NEXT")
    
    pdf.add_page()
    pdf.set_text_color(41, 128, 185)
    pdf.set_font("helvetica", "B", 20)
    pdf.cell(0, 15, "Introduction", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_text_color(50, 50, 50)
    pdf.set_font("helvetica", "", 12)
    content = f"Welcome to the {title}. This document provides comprehensive guidelines and procedural steps for utilizing this specific module within the BhuSetu National Land Governance Platform."
    pdf.multi_cell(0, 7, content)
    pdf.ln(15)
    
    pdf.set_fill_color(23, 107, 71)
    pdf.rect(10, pdf.get_y(), 190, 10, "F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_xy(12, pdf.get_y() + 2)
    pdf.cell(0, 6, "DIGITAL LAND PARCEL MAP", new_x="LMARGIN", new_y="NEXT")
    pdf.set_y(pdf.get_y() + 8)
    
    pdf.set_fill_color(240, 240, 240)
    pdf.rect(10, pdf.get_y(), 190, 70, "F")
    pdf.set_text_color(150, 150, 150)
    pdf.set_font("helvetica", "", 10)
    pdf.set_xy(10, pdf.get_y() + 30)
    pdf.cell(190, 10, "[ Map / Diagram Placeholder ]", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_y(pdf.get_y() + 40)
    
    pdf.add_page()
    pdf.set_text_color(41, 128, 185)
    pdf.set_font("helvetica", "B", 20)
    pdf.cell(0, 15, "Scope", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_text_color(50, 50, 50)
    pdf.set_font("helvetica", "", 12)
    content = f"This manual covers all features, workflows, and access requirements pertaining to {title}. Ensure you have the necessary role-based permissions (Researcher, Policymaker, or Department Admin) before attempting the steps outlined herein."
    pdf.multi_cell(0, 7, content)
    pdf.ln(10)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 10, "Project-related visuals", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_fill_color(255, 255, 255)
    pdf.set_draw_color(200, 200, 200)
    pdf.rect(15, pdf.get_y(), 180, 80, "DF")
    pdf.set_fill_color(23, 107, 71)
    pdf.rect(15, pdf.get_y(), 180, 10, "F")
    
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 10)
    pdf.set_xy(17, pdf.get_y() + 2)
    pdf.cell(0, 6, "BHUSETU - LAND GOVERNANCE DASHBOARD", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_y(pdf.get_y() + 80)
    
    pdf.add_page()
    pdf.set_text_color(41, 128, 185)
    pdf.set_font("helvetica", "B", 20)
    pdf.cell(0, 15, "Key Guidelines", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_text_color(50, 50, 50)
    pdf.set_font("helvetica", "", 12)
    pdf.set_x(15)
    pdf.multi_cell(0, 7, "- Always verify your data sources before upload or analysis.")
    pdf.set_x(15)
    pdf.multi_cell(0, 7, "- Geospatial mapping layers should be cross-referenced with official state repositories.")
    pdf.set_x(15)
    pdf.multi_cell(0, 7, "- For API access, ensure your authentication tokens are kept secure.")
    pdf.ln(15)
    
    pdf.set_text_color(41, 128, 185)
    pdf.set_font("helvetica", "B", 20)
    pdf.cell(0, 15, "Support", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_text_color(50, 50, 50)
    pdf.set_font("helvetica", "", 12)
    pdf.multi_cell(0, 7, f"If you encounter any issues while following this {title}, please reach out to the technical support team via the HelpDesk portal.")
    pdf.ln(10)
    
    pdf.set_fill_color(255, 255, 255)
    pdf.set_draw_color(200, 200, 200)
    pdf.rect(15, pdf.get_y(), 180, 70, "DF")
    pdf.set_fill_color(23, 107, 71)
    pdf.rect(15, pdf.get_y(), 180, 8, "F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 9)
    pdf.set_xy(17, pdf.get_y() + 1.5)
    pdf.cell(0, 5, "BHUSETU - LAND GOVERNANCE DASHBOARD", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_y(pdf.get_y() + 65)
    pdf.set_text_color(41, 128, 185)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 6, "Platform Support & Monitoring", new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(100, 100, 100)
    pdf.set_font("helvetica", "", 10)
    pdf.cell(0, 6, "Illustrative view of applications, GIS layers and support-oriented monitoring.", new_x="LMARGIN", new_y="NEXT")
    
    filename = title.replace(" ", "_") + ".pdf"
    pdf.output(f"manuals/{filename}")

manuals = [
    "Platform Overview Guide", "Researcher Data Access Manual", "GIS Layer Navigation", "Policy Simulation Handbook",
    "AI Research Assistant Guide", "Evidence Hub Walkthrough", "Uploading Department Datasets", "Collaboration Module Basics",
    "Land Records API Integration", "Case Study Submission Guide"
]

if not os.path.exists("manuals"):
    os.makedirs("manuals")

for m in manuals:
    make_pdf(m)
    
print("PDFs generated successfully!")
