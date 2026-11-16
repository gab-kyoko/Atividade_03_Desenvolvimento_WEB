from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.planning import SecoesPlano


class ClassInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nome: str = Field(min_length=2, max_length=80)
    disciplina: str = Field(min_length=2, max_length=80)
    alunos: int = Field(ge=1, le=100)
    dominios: str = Field(min_length=5, max_length=1000)
    dificuldades: str = Field(min_length=5, max_length=1000)
    interesses: str = Field(min_length=5, max_length=1000)


class PlanInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    turmaId: int = Field(ge=1)
    titulo: str = Field(min_length=5, max_length=120)
    material: str = Field(min_length=10, max_length=6000)
    objetivo: Literal["Aprofundar", "Reforçar", "Contextualizar"]
    status: Literal["Rascunho", "Aplicado"] = "Rascunho"
    atualizado: str
    secoes: SecoesPlano
    aplicadoEm: str | None = None
    observacao: str | None = None
