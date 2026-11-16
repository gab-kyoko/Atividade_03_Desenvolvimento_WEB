import asyncio
import json
from io import BytesIO

import httpx
from docx import Document
from pydantic import ValidationError

from app.config import Settings
from app.main import app
from app.schemas.planning import MaterialApoioGerado, MaterialApoioRequest, SugestaoRequest
from app.services.gemini import GeminiService
from app.services.document import build_support_document


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
    try:
        SugestaoRequest.model_validate({**PAYLOAD, "material": "curto"})
    except ValidationError:
        pass
    else:
        raise AssertionError("A short material must fail validation")


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


def test_support_material_generates_editable_document():
    async def scenario():
        generated = {
            "titulo": "Frações em receitas",
            "texto_explicativo": (
                "Frações equivalentes representam a mesma quantidade, mesmo quando usam "
                "números diferentes. Podemos multiplicar numerador e denominador pelo mesmo "
                "número para encontrá-las.\n\nEm uma receita, meia xícara equivale a duas "
                "medidas de um quarto de xícara."
            ),
            "questoes": [
                "Por que 1/2 e 2/4 representam a mesma quantidade?",
                "Quantas medidas de 1/4 completam uma xícara?",
                "Como você pode criar outra fração equivalente a 1/2?",
            ],
        }

        def provider(request: httpx.Request) -> httpx.Response:
            prompt = json.loads(request.content)["contents"][0]["parts"][0]["text"]
            assert "abertura" in prompt
            assert "Receitas da comunidade" in prompt
            return httpx.Response(200, json={"candidates": [{"content": {"parts": [{"text": json.dumps(generated)}]}}]})

        payload = MaterialApoioRequest.model_validate({
            **PAYLOAD,
            "titulo": "Frações para o cotidiano",
            "secoes": {
                "abertura": "Comece com uma receita conhecida e pergunte as quantidades.",
                "desenvolvimento": "Peça que a turma compare porções de duas receitas.",
                "fechamento": "Retome as equivalências encontradas pelos grupos.",
            },
        })
        async with httpx.AsyncClient(transport=httpx.MockTransport(provider)) as client:
            material = await GeminiService(Settings("test-key", "gemini-3.5-flash-lite", ()), client).support_material(payload)
        document = Document(BytesIO(build_support_document(payload, material)))
        paragraphs = [paragraph.text for paragraph in document.paragraphs]
        text = "\n".join(paragraphs)
        assert "Frações em receitas" in text
        assert paragraphs.index("Texto explicativo") < paragraphs.index("Questões")
        assert "Frações equivalentes representam" in text
        assert "Por que 1/2 e 2/4" in text
        assert "Atividades" not in text
        assert "Para pensar e conversar" not in text
        assert "Revise antes de usar" in text

    asyncio.run(scenario())


def test_support_material_rejects_statements_in_place_of_questions():
    try:
        MaterialApoioGerado.model_validate({
            "titulo": "Frações em receitas",
            "texto_explicativo": "Frações equivalentes representam a mesma quantidade. " * 3,
            "questoes": ["Compare duas frações.", "O que é uma fração?", "Por que são equivalentes?"],
        })
    except ValidationError:
        pass
    else:
        raise AssertionError("Uma instrução não deve substituir uma questão")
