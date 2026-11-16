import { Adaptacao } from "@/types/adaptacao";

// Dados verossímeis ao domínio, como a avaliação pede.
export const adaptacoesMock: Adaptacao[] = [
  {
    id: 1,
    turma: "7º B",
    conteudoBase: "Frações equivalentes",
    dificuldade: "Turma confunde simplificação com divisão de numerador apenas",
    adaptacao: "Atividade com dobraduras de papel antes da parte formal",
  },
  {
    id: 2,
    turma: "9º A",
    conteudoBase: "Revolução Industrial",
    dificuldade:
      "Interesse alto em impactos locais (indústria têxtil da região)",
    adaptacao: "Aprofundar com estudo de caso da cidade",
  },
];
