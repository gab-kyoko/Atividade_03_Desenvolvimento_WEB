"use client";
import { useState } from "react";
import { turmasMock, planosMock } from "@/data/workspaceMock";
import type { Plano, Tela, Turma } from "@/types/workspace";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { Classes } from "./Classes";
import { PlanWizard } from "./PlanWizard";
import { PlanEditor } from "./PlanEditor";
import { History } from "./History";

export function Workspace() {
  // tela atual, turmas e planos ficam todos aqui
  const [tela, setTela] = useState<Tela>("inicio");
  const [turmas, setTurmas] = useState<Turma[]>(turmasMock);
  const [planos, setPlanos] = useState<Plano[]>(planosMock);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // troca de tela e volta pro topo
  const navigate = (next: Tela) => {
    setTela(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // abre o plano no editor
  const open = (id: number) => {
    setSelectedId(id);
    navigate("editor");
  };
  // se a turma já existe edita, senão adiciona
  const saveClass = (turma: Turma) =>
    setTurmas((current) =>
      current.some((t) => t.id === turma.id)
        ? current.map((t) => (t.id === turma.id ? turma : t))
        : [...current, turma],
    );
  // plano novo vai pro começo da lista e já abre pra revisão
  const create = (plano: Plano) => {
    setPlanos((current) => [plano, ...current]);
    open(plano.id);
  };
  // atualiza só o plano que foi alterado
  const savePlan = (plano: Plano) =>
    setPlanos((current) => current.map((p) => (p.id === plano.id ? plano : p)));
  // copia o plano pra outra turma como rascunho novo
  const duplicate = (id: number, turmaId: number) => {
    const source = planos.find((p) => p.id === id);
    if (!source) return;
    const copy = {
      ...source,
      id: Date.now(),
      turmaId,
      titulo: `${source.titulo} (cópia)`,
      secoes: { ...source.secoes },
      status: "Rascunho" as const,
      atualizado: new Date().toISOString().slice(0, 10),
      aplicadoEm: undefined,
      observacao: undefined,
    };
    create(copy);
  };
  // plano aberto no editor
  const selected = planos.find((p) => p.id === selectedId);
  return (
    <div className="workspace-shell">
      <Sidebar tela={tela} onNavigate={navigate} />
      <div className="workspace-main">
        {/* barra do topo com o caminho da página */}
        <header className="topbar">
          <span>
            Área de planejamento <span>/</span>{" "}
            {tela === "editor"
              ? "Revisão"
              : {
                  inicio: "Início",
                  turmas: "Minhas Turmas",
                  novo: "Novo Planejamento",
                  historico: "Histórico",
                }[tela]}
          </span>
          <span className="demo-badge">● Dados demonstrativos</span>
        </header>
        <main className="page-content">
          {/* cada tela só aparece quando bate com o estado */}
          {tela === "inicio" && (
            <Dashboard
              turmas={turmas}
              planos={planos}
              onNew={() => navigate("novo")}
              onOpen={open}
            />
          )}
          {tela === "turmas" && <Classes turmas={turmas} onSave={saveClass} />}
          {tela === "novo" && <PlanWizard turmas={turmas} onCreate={create} />}
          {tela === "historico" && (
            <History
              planos={planos}
              turmas={turmas}
              onOpen={open}
              onDuplicate={duplicate}
            />
          )}
          {tela === "editor" && selected && (
            <PlanEditor
              key={selected.id}
              plano={selected}
              turma={turmas.find((t) => t.id === selected.turmaId)}
              onSave={savePlan}
              onBack={() => navigate("historico")}
            />
          )}
        </main>
        {/* rodapé */}
        <footer>
          Entrelinha · Ana Luiza e Gabrielle Kyoko{" "}
          <span>Sprint 2 — planejamento com apoio de IA</span>
        </footer>
      </div>
    </div>
  );
}
