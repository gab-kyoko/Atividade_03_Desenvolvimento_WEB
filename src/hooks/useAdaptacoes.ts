// hooks/useAdaptacoes.ts
"use client";
import { useState } from "react";
import { Adaptacao } from "@/types/adaptacao";
import { adaptacoesMock } from "@/data/mock";

// Centralizo o estado num hook para os componentes não saberem de onde
// os dados vêm. Na Sprint 3 só troco o mock por chamadas à API aqui dentro.
export function useAdaptacoes() {
  const [adaptacoes, setAdaptacoes] = useState<Adaptacao[]>(adaptacoesMock);

  const adicionar = (dados: Omit<Adaptacao, "id">) => {
    // Date.now() como id é provisório; o banco gera o id na Sprint 4.
    setAdaptacoes((atual) => [{ ...dados, id: Date.now() }, ...atual]);
  };

  return { adaptacoes, adicionar };
}