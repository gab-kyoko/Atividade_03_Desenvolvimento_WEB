// types/adaptacao.ts
// Defino o formato dos dados aqui para o front e (na Sprint 2) os schemas Pydantic ficarem alinhados.
export type Adaptacao = {
  id: number;
  turma: string;
  conteudoBase: string; // o que o RCO prevê
  dificuldade: string;  // o que observei em aula
  adaptacao: string;    // o que vou fazer diferente
};