"use client";
import { useEffect, useState } from "react";
import { turmasMock, planosMock } from "@/data/workspaceMock";
import type { Plano, Tela, Turma } from "@/types/workspace";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { Classes } from "./Classes";
import { PlanWizard } from "./PlanWizard";
import { PlanEditor } from "./PlanEditor";
import { History } from "./History";
import { Login } from "./Login";
import { apiRequest } from "@/services/api";

export function Workspace() {
  // tela atual, turmas e planos ficam todos aqui
  const [tela, setTela] = useState<Tela>("inicio");
  const [turmas, setTurmas] = useState<Turma[]>(turmasMock);
  const [planos, setPlanos] = useState<Plano[]>(planosMock);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const saved = window.localStorage.getItem("entrelinha_token");
    if (!saved) { setChecking(false); return; }
    void apiRequest<{ email: string }>("/auth/me", saved)
      .then(() => setToken(saved))
      .catch(() => window.localStorage.removeItem("entrelinha_token"))
      .finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (!token) return;
    void Promise.all([
      apiRequest<Turma[]>("/turmas", token),
      apiRequest<Plano[]>("/planos", token),
    ]).then(([classes, plans]) => { setTurmas(classes); setPlanos(plans); })
      .catch(cause => setNotice(cause instanceof Error ? cause.message : "Falha ao carregar dados."));
  }, [token]);
  const login = (value: string) => { window.localStorage.setItem("entrelinha_token", value); setToken(value); };
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
  const saveClass = (turma: Turma) => {
    if (!token) return;
    const exists = turmas.some(t => t.id === turma.id);
    void apiRequest<Turma>(exists ? `/turmas/${turma.id}` : "/turmas", token, exists ? "PUT" : "POST", turma)
      .then(saved => setTurmas(current => exists ? current.map(t => t.id === saved.id ? saved : t) : [...current, saved]))
      .catch(cause => setNotice(cause instanceof Error ? cause.message : "Falha ao salvar turma."));
  };
  // plano novo vai pro começo da lista e já abre pra revisão
  const create = (plano: Plano) => {
    if (!token) return;
    void apiRequest<Plano>("/planos", token, "POST", plano)
      .then(saved => { setPlanos(current => [saved, ...current]); open(saved.id); })
      .catch(cause => setNotice(cause instanceof Error ? cause.message : "Falha ao salvar plano."));
  };
  // atualiza só o plano que foi alterado
  const savePlan = (plano: Plano) => {
    if (!token) return;
    void apiRequest<Plano>(`/planos/${plano.id}`, token, "PUT", plano)
      .then(saved => setPlanos(current => current.map(p => p.id === saved.id ? saved : p)))
      .catch(cause => setNotice(cause instanceof Error ? cause.message : "Falha ao salvar plano."));
  };
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
  if (checking) return <p className="login-screen">Carregando...</p>;
  if (!token) return <Login onLogin={login} />;
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
          <button className="link-action" onClick={() => { window.localStorage.removeItem("entrelinha_token"); setToken(null); setTurmas([]); setPlanos([]); }}>Sair</button>
        </header>
        <main className="page-content">
          {notice && <p role="alert" className="form-error">{notice}</p>}
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
          {tela === "novo" && <PlanWizard turmas={turmas} onCreate={create} token={token} />}
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
