// perfil da turma
export type Turma = {
  id: number;
  nome: string;
  disciplina: string;
  alunos: number;
  dominios: string;
  dificuldades: string;
  interesses: string;
};
// objetivos que o professor pode escolher
export type Objetivo = "Aprofundar" | "Reforçar" | "Contextualizar";
// partes do plano de aula
export type Secao = "abertura" | "desenvolvimento" | "fechamento";
// plano ligado a uma turma pelo turmaId
export type Plano = {
  id: number;
  turmaId: number;
  titulo: string;
  material: string;
  objetivo: Objetivo;
  secoes: Record<Secao, string>;
  status: "Rascunho" | "Aplicado";
  atualizado: string;
  aplicadoEm?: string;
  observacao?: string;
};
// telas do sistema (troca por estado, sem rotas)
export type Tela = "inicio" | "turmas" | "novo" | "historico" | "editor";
