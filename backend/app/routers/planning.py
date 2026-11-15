from collections.abc import AsyncIterator

import httpx
from fastapi import APIRouter, Depends

from app.config import get_settings
from app.schemas.planning import SugestaoRequest, SugestaoResponse
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
) -> SugestaoResponse:
    return await service.suggest(payload)
