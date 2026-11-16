from collections.abc import AsyncIterator

import httpx
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from app.auth import current_user
from app.models import User

from app.config import get_settings
from app.schemas.planning import MaterialApoioRequest, SugestaoRequest, SugestaoResponse
from app.services.document import build_support_document
from app.services.gemini import GeminiService

router = APIRouter(prefix="/api/v1/planos", tags=["Planejamento com IA"])


async def get_gemini_service() -> AsyncIterator[GeminiService]:
    async with httpx.AsyncClient(timeout=25.0) as client:
        yield GeminiService(get_settings(), client)


@router.post(
    "/sugerir",
    response_model=SugestaoResponse,
    summary="Sugerir um plano adaptado ao perfil da turma",
    responses={502: {"description": "Falha no provedor de IA"}, 503: {"description": "IA indisponível"}, 504: {"description": "Tempo esgotado"}},
)
async def sugerir_plano(
    payload: SugestaoRequest,
    service: GeminiService = Depends(get_gemini_service),
    user: User = Depends(current_user),
) -> SugestaoResponse:
    return await service.suggest(payload)


@router.post(
    "/material-apoio",
    summary="Gerar arquivo de apoio editável para a turma",
    responses={502: {"description": "Falha no provedor de IA"}, 503: {"description": "IA indisponível"}},
)
async def gerar_material_apoio(
    payload: MaterialApoioRequest,
    service: GeminiService = Depends(get_gemini_service),
    user: User = Depends(current_user),
) -> Response:
    content = await service.support_material(payload)
    document = build_support_document(payload, content)
    return Response(
        content=document,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": 'attachment; filename="material-de-apoio.docx"'},
    )
