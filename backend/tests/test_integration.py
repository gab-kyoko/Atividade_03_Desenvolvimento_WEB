import asyncio

import httpx
from sqlmodel import Session, SQLModel, create_engine

from app.database import get_session
from app.main import app


def test_login_and_private_planning_flow(tmp_path, monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "sprint-three-test-secret-with-32-characters")
    engine = create_engine(f"sqlite:///{tmp_path / 'test.db'}", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)

    def test_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = test_session

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            first = await client.post("/api/v1/auth/register", json={"email": "ana@example.com", "password": "senha12345"})
            assert first.status_code == 201
            second = await client.post("/api/v1/auth/register", json={"email": "bia@example.com", "password": "senha12345"})
            assert second.status_code == 201
            login = await client.post("/api/v1/auth/login", json={"email": "ana@example.com", "password": "senha12345"})
            assert login.status_code == 200
            ana = {"Authorization": f"Bearer {login.json()['access_token']}"}
            bia = {"Authorization": f"Bearer {second.json()['access_token']}"}

            classroom = {
                "nome": "7º Ano B", "disciplina": "Matemática", "alunos": 29,
                "dominios": "Operações básicas", "dificuldades": "Frações equivalentes",
                "interesses": "Receitas da comunidade",
            }
            assert (await client.get("/api/v1/turmas")).status_code == 403
            saved_class = await client.post("/api/v1/turmas", headers=ana, json=classroom)
            assert saved_class.status_code == 201
            class_id = saved_class.json()["id"]
            assert (await client.get("/api/v1/turmas", headers=bia)).json() == []
            assert (await client.put(f"/api/v1/turmas/{class_id}", headers=bia, json=classroom)).status_code == 404

            plan = {
                "turmaId": class_id, "titulo": "Frações em receitas", "material": "Frações equivalentes no RCO.",
                "objetivo": "Contextualizar", "status": "Rascunho", "atualizado": "2026-11-15",
                "secoes": {
                    "abertura": "Apresente uma receita conhecida pela turma.",
                    "desenvolvimento": "Compare porções e registre frações equivalentes.",
                    "fechamento": "Peça exemplos e registre uma dúvida de cada grupo.",
                },
            }
            assert (await client.post("/api/v1/planos", headers=bia, json=plan)).status_code == 404
            saved_plan = await client.post("/api/v1/planos", headers=ana, json=plan)
            assert saved_plan.status_code == 201
            assert len((await client.get("/api/v1/planos", headers=ana)).json()) == 1
            assert (await client.get("/api/v1/planos", headers=bia)).json() == []
            assert (await client.post("/api/v1/planos/sugerir", json={
                "turma": {"id": class_id, **classroom}, "material": plan["material"], "objetivo": plan["objetivo"]
            })).status_code == 403

    try:
        asyncio.run(scenario())
    finally:
        app.dependency_overrides.clear()
        engine.dispose()
