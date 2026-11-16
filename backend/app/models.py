from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str


class ClassRoom(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id", index=True)
    nome: str
    disciplina: str
    alunos: int
    dominios: str
    dificuldades: str
    interesses: str


class LessonPlan(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id", index=True)
    turma_id: int = Field(foreign_key="classroom.id")
    titulo: str
    material: str
    objetivo: str
    status: str = "Rascunho"
    atualizado: str
    abertura: str
    desenvolvimento: str
    fechamento: str
    aplicado_em: str | None = None
    observacao: str | None = None
