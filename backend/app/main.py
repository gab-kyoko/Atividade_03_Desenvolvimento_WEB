from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers.planning import router as planning_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Entrelinhas API",
        description="API de apoio ao planejamento docente. Sugestões de IA exigem revisão do professor.",
        version="0.2.0",
    )
    origins = get_settings().cors_origins
    if origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(origins),
            allow_credentials=False,
            allow_methods=["GET", "POST"],
            allow_headers=["Content-Type"],
        )
    app.include_router(planning_router)

    @app.get("/health", tags=["Sistema"])
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
