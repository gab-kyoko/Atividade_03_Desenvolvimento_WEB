from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers.planning import router as planning_router
from app.routers.accounts import router as accounts_router
from app.routers.workspace import router as workspace_router
from app.database import create_db


def create_app() -> FastAPI:
    app = FastAPI(
        title="Entrelinhas API",
        description="API de apoio ao planejamento docente. Sugestões de IA exigem revisão do professor.",
        version="0.2.0",
    )
    origins = get_settings().cors_origins
    if origins:
        # Só as origens configuradas podem chamar a API pelo navegador.
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(origins),
            allow_credentials=False,
            allow_methods=["GET", "POST", "PUT", "DELETE"],
            allow_headers=["Content-Type", "Authorization"],
        )
    app.include_router(planning_router)
    app.include_router(accounts_router)
    app.include_router(workspace_router)

    @app.on_event("startup")
    def startup() -> None:
        create_db()

    @app.get("/health", tags=["Sistema"])
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
