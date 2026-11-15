export type Turma = { id: number; nome: string; disciplina: string; alunos: number; dominios: string; dificuldades: string; interesses: string };
export type Objetivo = "Aprofundar" | "Reforçar" | "Contextualizar";
export type Secao = "abertura" | "desenvolvimento" | "fechamento";
export type Plano = { id: number; turmaId: number; titulo: string; material: string; objetivo: Objetivo; secoes: Record<Secao, string>; status: "Rascunho" | "Aplicado"; atualizado: string; aplicadoEm?: string; observacao?: string };
export type Tela = "inicio" | "turmas" | "novo" | "historico" | "editor";
