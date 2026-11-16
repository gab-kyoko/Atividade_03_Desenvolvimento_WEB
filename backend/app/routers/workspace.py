from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.auth import current_user
from app.database import get_session
from app.models import ClassRoom, LessonPlan, User
from app.schemas.workspace import ClassInput, PlanInput

router = APIRouter(prefix="/api/v1", tags=["Área docente"])


def plan_output(plan: LessonPlan) -> dict:
    return {"id": plan.id, "turmaId": plan.turma_id, "titulo": plan.titulo,
            "material": plan.material, "objetivo": plan.objetivo, "status": plan.status,
            "atualizado": plan.atualizado, "secoes": {"abertura": plan.abertura,
            "desenvolvimento": plan.desenvolvimento, "fechamento": plan.fechamento},
            "aplicadoEm": plan.aplicado_em, "observacao": plan.observacao}


def owned_class(session: Session, class_id: int, user_id: int) -> ClassRoom:
    # Cada docente acessa apenas as próprias turmas.
    item = session.get(ClassRoom, class_id)
    if not item or item.owner_id != user_id:
        raise HTTPException(404, "Turma não encontrada.")
    return item


@router.get("/turmas")
def list_classes(user: User = Depends(current_user), session: Session = Depends(get_session)) -> list[ClassRoom]:
    return list(session.exec(select(ClassRoom).where(ClassRoom.owner_id == user.id)))


@router.post("/turmas", status_code=201)
def create_class(data: ClassInput, user: User = Depends(current_user), session: Session = Depends(get_session)) -> ClassRoom:
    item = ClassRoom(**data.model_dump(), owner_id=user.id)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.put("/turmas/{class_id}")
def update_class(class_id: int, data: ClassInput, user: User = Depends(current_user), session: Session = Depends(get_session)) -> ClassRoom:
    item = owned_class(session, class_id, user.id)
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.get("/planos")
def list_plans(user: User = Depends(current_user), session: Session = Depends(get_session)) -> list[dict]:
    return [plan_output(p) for p in session.exec(select(LessonPlan).where(LessonPlan.owner_id == user.id))]


def apply_plan(item: LessonPlan, data: PlanInput) -> None:
    for key in ("titulo", "material", "objetivo", "status", "atualizado", "observacao"):
        setattr(item, key, getattr(data, key))
    item.turma_id = data.turmaId
    item.aplicado_em = data.aplicadoEm
    item.abertura = data.secoes.abertura
    item.desenvolvimento = data.secoes.desenvolvimento
    item.fechamento = data.secoes.fechamento


@router.post("/planos", status_code=201)
def create_plan(data: PlanInput, user: User = Depends(current_user), session: Session = Depends(get_session)) -> dict:
    owned_class(session, data.turmaId, user.id)
    item = LessonPlan(owner_id=user.id, turma_id=data.turmaId, titulo="", material="", objetivo="", atualizado="", abertura="", desenvolvimento="", fechamento="")
    apply_plan(item, data)
    session.add(item)
    session.commit()
    session.refresh(item)
    return plan_output(item)


@router.put("/planos/{plan_id}")
def update_plan(plan_id: int, data: PlanInput, user: User = Depends(current_user), session: Session = Depends(get_session)) -> dict:
    item = session.get(LessonPlan, plan_id)
    if not item or item.owner_id != user.id:
        raise HTTPException(404, "Plano não encontrado.")
    owned_class(session, data.turmaId, user.id)
    apply_plan(item, data)
    session.add(item)
    session.commit()
    session.refresh(item)
    return plan_output(item)
