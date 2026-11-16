import asyncio
import json

import httpx

from app.config import Settings
from app.main import app
from app.schemas.planning import SugestaoRequest
from app.services.gemini import GeminiService


PAYLOAD = {
    "turma": {
        "id": 1,
        "nome": "7º Ano B",
        "disciplina": "Matemática",
        "alunos": 29,
        "dominios": "Operações básicas e leitura de gráficos",
        "dificuldades": "Comparar frações equivalentes",
        "interesses": "Receitas da comunidade e jogos",
    },
    "material": "Frações equivalentes e representação de quantidades no RCO.",
    "objetivo": "Contextualizar",
}


def test_health_and_documentation():
    async def scenario():
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            assert (await client.get("/health")).json() == {"status": "ok"}
            assert (await client.get("/docs")).status_code == 200
    asyncio.run(scenario())


def test_invalid_request_is_rejected_before_calling_ai():
    async def scenario():
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/v1/planos/sugerir", json={**PAYLOAD, "material": "curto"})
            assert response.status_code == 422
    asyncio.run(scenario())


def test_missing_key_returns_actionable_error():
    async def scenario():
        async with httpx.AsyncClient() as client:
            service = GeminiService(Settings("", "gemini-3.5-flash-lite", ()), client)
            try:
                await service.suggest(SugestaoRequest.model_validate(PAYLOAD))
            except Exception as exc:
                assert exc.status_code == 503
                assert "GEMINI_API_KEY" in exc.detail
            else:
                raise AssertionError("Missing API key must fail")

    asyncio.run(scenario())


def test_ai_response_is_parsed_and_prompt_uses_turma_context():
    async def scenario():
        def provider(request: httpx.Request) -> httpx.Response:
            assert request.headers["x-goog-api-key"] == "test-key"
            data = json.loads(request.content)
            prompt = data["contents"][0]["parts"][0]["text"]
            assert "Receitas da comunidade" in prompt
            assert "Frações equivalentes" in prompt
            assert data["generationConfig"]["responseMimeType"] == "application/json"
            generated = {"titulo": "Frações em receitas", "secoes": {
                "abertura": "Compare duas receitas conhecidas pela turma e levante hipóteses.",
                "desenvolvimento": "Em grupos, ajustem porções e registrem frações equivalentes.",
                "fechamento": "Cada grupo explica uma equivalência e registra uma dúvida.",
            }}
            return httpx.Response(200, json={"candidates": [{"content": {"parts": [{"text": json.dumps(generated)}]}}]})

        async with httpx.AsyncClient(transport=httpx.MockTransport(provider)) as client:
            service = GeminiService(Settings("test-key", "gemini-3.5-flash-lite", ()), client)
            answer = await service.suggest(SugestaoRequest.model_validate(PAYLOAD))
            assert answer.titulo == "Frações em receitas"
            assert answer.secoes.desenvolvimento.startswith("Em grupos")
            assert answer.modelo == "gemini-3.5-flash-lite"

    asyncio.run(scenario())


def test_provider_quota_error_does_not_expose_provider_body():
    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(lambda _: httpx.Response(429, text="private details"))) as client:
            service = GeminiService(Settings("test-key", "gemini-3.5-flash-lite", ()), client)
            try:
                await service.suggest(SugestaoRequest.model_validate(PAYLOAD))
            except Exception as exc:
                assert exc.status_code == 503
                assert "private details" not in exc.detail
            else:
                raise AssertionError("Quota error must fail")

    asyncio.run(scenario())
