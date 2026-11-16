from io import BytesIO

from docx import Document
from docx.shared import Cm, Pt

from app.schemas.planning import MaterialApoioGerado, MaterialApoioRequest


def build_support_document(request: MaterialApoioRequest, content: MaterialApoioGerado) -> bytes:
    document = Document()
    section = document.sections[0]
    section.top_margin = section.bottom_margin = Cm(2)
    section.left_margin = section.right_margin = Cm(2.3)
    styles = document.styles
    styles["Normal"].font.name = "Arial"
    styles["Normal"].font.size = Pt(11)

    document.add_heading(content.titulo, 0)
    document.add_paragraph(f"{request.turma.disciplina} · {request.turma.nome}")
    document.add_paragraph("Nome: ____________________________________  Data: ____/____/______")
    document.add_heading("Texto explicativo", level=1)
    for paragraph in content.texto_explicativo.split("\n\n"):
        if paragraph.strip():
            document.add_paragraph(paragraph.strip())

    document.add_heading("Questões", level=1)
    for number, question in enumerate(content.questoes, start=1):
        document.add_paragraph(f"{number}. {question}")
        document.add_paragraph("________________________________________________________________________")

    document.add_paragraph("Material gerado com apoio de IA. Revise antes de usar com a turma.")
    output = BytesIO()
    document.save(output)
    return output.getvalue()
