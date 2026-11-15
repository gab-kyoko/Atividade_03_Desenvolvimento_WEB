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
  const [tela, setTela] = useState<Tela>("inicio");
  const [turmas, setTurmas] = useState<Turma[]>(turmasMock);
  const [planos, setPlanos] = useState<Plano[]>(planosMock);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = (next: Tela) => { setTela(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const open = (id: number) => { setSelectedId(id); navigate("editor"); };
  const saveClass = (turma: Turma) => setTurmas(current => current.some(t => t.id === turma.id) ? current.map(t => t.id === turma.id ? turma : t) : [...current, turma]);
  const create = (plano: Plano) => { setPlanos(current => [plano, ...current]); open(plano.id); };
  const savePlan = (plano: Plano) => setPlanos(current => current.map(p => p.id === plano.id ? plano : p));
  const duplicate = (id: number, turmaId: number) => { const source = planos.find(p => p.id === id); if (!source) return; const copy = { ...source, id: Date.now(), turmaId, titulo: `${source.titulo} (cópia)`, secoes: { ...source.secoes }, status: "Rascunho" as const, atualizado: new Date().toISOString().slice(0, 10), aplicadoEm: undefined, observacao: undefined }; create(copy); };
  const selected = planos.find(p => p.id === selectedId);
  return <div className="workspace-shell"><Sidebar tela={tela} onNavigate={navigate} /><div className="workspace-main"><header className="topbar"><span>Área de planejamento <span>/</span> {tela === "editor" ? "Revisão" : { inicio: "Início", turmas: "Minhas Turmas", novo: "Novo Planejamento", historico: "Histórico" }[tela]}</span><span className="demo-badge">● Dados demonstrativos</span></header><main className="page-content">{tela === "inicio" && <Dashboard turmas={turmas} planos={planos} onNew={() => navigate("novo")} onOpen={open} />}{tela === "turmas" && <Classes turmas={turmas} onSave={saveClass} />}{tela === "novo" && <PlanWizard turmas={turmas} onCreate={create} />}{tela === "historico" && <History planos={planos} turmas={turmas} onOpen={open} onDuplicate={duplicate} />}{tela === "editor" && selected && <PlanEditor key={selected.id} plano={selected} turma={turmas.find(t => t.id === selected.turmaId)} onSave={savePlan} onBack={() => navigate("historico")} />}</main><footer>Adapta · Ana Luiza e Gabrielle Kyoko <span>Sprint 1 — protótipo com dados mockados</span></footer></div></div>;
}
