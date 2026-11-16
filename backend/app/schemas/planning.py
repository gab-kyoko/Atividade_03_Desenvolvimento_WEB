from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TurmaContexto(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    id: int = Field(ge=1)
    nome: str = Field(min_length=2, max_length=80)
    disciplina: str = Field(min_length=2, max_length=80)
    alunos: int = Field(ge=1, le=100)
    dominios: str = Field(min_length=5, max_length=1000)
    dificuldades: str = Field(min_length=5, max_length=1000)
    interesses: str = Field(min_length=5, max_length=1000)


class SugestaoRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    turma: TurmaContexto
    material: str = Field(min_length=10, max_length=6000)
    objetivo: Literal["Aprofundar", "Reforçar", "Contextualizar"]


class SecoesPlano(BaseModel):
    abertura: str = Field(min_length=20, max_length=3000)
    desenvolvimento: str = Field(min_length=20, max_length=5000)
    fechamento: str = Field(min_length=20, max_length=3000)


class ConteudoGerado(BaseModel):
    titulo: str = Field(min_length=5, max_length=120)
    secoes: SecoesPlano


class SugestaoResponse(ConteudoGerado):
    modelo: str
    aviso: str = "Sugestão assistida por IA. Revise e adapte antes de aplicar com a turma."


class MaterialApoioRequest(SugestaoRequest):
    titulo: str = Field(min_length=5, max_length=120)
    secoes: SecoesPlano


class MaterialApoioGerado(BaseModel):
    titulo: str = Field(min_length=5, max_length=120)
    texto_explicativo: str = Field(min_length=100, max_length=4000)
    questoes: list[str] = Field(min_length=3, max_length=5)

    @field_validator("questoes")
    @classmethod
    def validate_questions(cls, questions: list[str]) -> list[str]:
        if any(not question.strip().endswith("?") for question in questions):
            raise ValueError("Cada questão deve ser uma pergunta.")
        return [question.strip() for question in questions]
