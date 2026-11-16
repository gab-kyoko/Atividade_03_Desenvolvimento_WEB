import type { Plano, Turma } from "@/types/workspace";

// turmas de exemplo (dados fictícios)
export const turmasMock: Turma[] = [
  {
    id: 1,
    nome: "7º Ano B",
    disciplina: "Matemática",
    alunos: 29,
    dominios: "Operações básicas e leitura de gráficos simples",
    dificuldades: "Frações equivalentes e comparação de medidas",
    interesses: "Culinária, jogos e exemplos do comércio local",
  },
  {
    id: 2,
    nome: "8º Ano A",
    disciplina: "História",
    alunos: 31,
    dominios: "Linha do tempo e pesquisa em fontes visuais",
    dificuldades: "Relacionar processos históricos à vida cotidiana",
    interesses: "Memórias do bairro e relatos de familiares",
  },
  {
    id: 3,
    nome: "6º Ano C",
    disciplina: "Ciências",
    alunos: 27,
    dominios: "Ciclo da água e observação da natureza",
    dificuldades: "Distinguir tratamento da água de preservação de nascentes",
    interesses: "Rio da cidade e atividades ao ar livre",
  },
];

// planos de exemplo, cada um aponta pra uma turma
export const planosMock: Plano[] = [
  {
    id: 1,
    turmaId: 1,
    titulo: "Frações no cotidiano",
    material: "RCO: frações equivalentes e representação de quantidades.",
    objetivo: "Contextualizar",
    secoes: {
      abertura:
        "Comparar receitas conhecidas pela turma e perguntar como ajustar porções.",
      desenvolvimento:
        "Em grupos, medir ingredientes e representar as equivalências com desenhos e frações.",
      fechamento:
        "Cada grupo explica uma equivalência encontrada e registra uma dúvida.",
    },
    status: "Rascunho",
    atualizado: "2026-11-14",
  },
  {
    id: 2,
    turmaId: 2,
    titulo: "Memórias do bairro",
    material: "RCO: fontes históricas e transformações do espaço urbano.",
    objetivo: "Aprofundar",
    secoes: {
      abertura: "Mostrar uma fotografia antiga da região e levantar hipóteses.",
      desenvolvimento:
        "Comparar relatos de moradores com as fontes do material-base.",
      fechamento:
        "Organizar uma linha do tempo coletiva com mudanças percebidas.",
    },
    status: "Rascunho",
    atualizado: "2026-11-12",
  },
  {
    id: 3,
    turmaId: 3,
    titulo: "Água e território",
    material: "RCO: uso da água e cuidado com recursos hídricos.",
    objetivo: "Reforçar",
    secoes: {
      abertura: "Perguntar de onde vem a água usada na escola.",
      desenvolvimento:
        "Mapear o percurso da água e classificar ações de tratamento e preservação.",
      fechamento:
        "Produzir um bilhete com uma ação de cuidado possível no bairro.",
    },
    status: "Aplicado",
    atualizado: "2026-11-08",
    aplicadoEm: "2026-11-08",
  },
];
