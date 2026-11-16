"use client";
import { useEffect, useState } from "react";
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
  // A API é a fonte dos dados após o login.
  const [tela, setTela] = useState<Tela>("inicio");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [reload, setReload] = useState(0);
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
    let active = true;
    setLoadingData(true);
    setLoadError("");
    void Promise.all([
      apiRequest<Turma[]>("/turmas", token),
      apiRequest<Plano[]>("/planos", token),
    ]).then(([classes, plans]) => {
      if (active) { setTurmas(classes); setPlanos(plans); }
    }).catch(cause => {
      if (active) setLoadError(cause instanceof Error ? cause.message : "Falha ao carregar dados.");
    }).finally(() => { if (active) setLoadingData(false); });
    return () => { active = false; };
  }, [token, reload]);
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
  const saveClass = async (turma: Turma) => {
    if (!token) throw new Error("Entre novamente para salvar a turma.");
    const exists = turmas.some(t => t.id === turma.id);
    const saved = await apiRequest<Turma>(exists ? `/turmas/${turma.id}` : "/turmas", token, exists ? "PUT" : "POST", turma);
    setTurmas(current => exists ? current.map(t => t.id === saved.id ? saved : t) : [...current, saved]);
  };
  // plano novo vai pro começo da lista e já abre pra revisão
  const create = async (plano: Plano) => {
    if (!token) throw new Error("Entre novamente para salvar o plano.");
    const saved = await apiRequest<Plano>("/planos", token, "POST", plano);
    setPlanos(current => [saved, ...current]);
    open(saved.id);
  };
  // atualiza só o plano que foi alterado
  const savePlan = async (plano: Plano) => {
    if (!token) throw new Error("Entre novamente para salvar o plano.");
    const saved = await apiRequest<Plano>(`/planos/${plano.id}`, token, "PUT", plano);
    setPlanos(current => current.map(p => p.id === saved.id ? saved : p));
  };
  // copia o plano pra outra turma como rascunho novo
  const duplicate = async (id: number, turmaId: number) => {
    const source = planos.find((p) => p.id === id);
    if (!source) throw new Error("Plano não encontrado.");
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
    await create(copy);
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
          {loadingData && <div className="empty-state" role="status">Carregando turmas e planos...</div>}
          {loadError && (
            <div role="alert" className="empty-state">
              <p>{loadError}</p>
              <button className="secondary-action" onClick={() => setReload(value => value + 1)}>Tentar novamente</button>
            </div>
          )}
          {!loadingData && !loadError && (
            <>
              {tela === "inicio" && (
                <Dashboard
                  turmas={turmas}
                  planos={planos}
                  onNew={() => navigate("novo")}
                  onClasses={() => navigate("turmas")}
                  onOpen={open}
                />
              )}
              {tela === "turmas" && <Classes turmas={turmas} onSave={saveClass} />}
              {tela === "novo" && <PlanWizard turmas={turmas} onCreate={create} token={token} />}
              {tela === "historico" && (
                <History planos={planos} turmas={turmas} onOpen={open} onDuplicate={duplicate} />
              )}
              {tela === "editor" && selected && (
                <PlanEditor
                  key={selected.id}
                  plano={selected}
                  turma={turmas.find((t) => t.id === selected.turmaId)}
                  onSave={savePlan}
                  onBack={() => navigate("historico")}
                  token={token}
                />
              )}
            </>
          )}
        </main>
        {/* rodapé */}
        <footer>
          Entrelinha · Ana Luiza e Gabrielle Kyoko{" "}
          <span>Planejamento com apoio de IA</span>
        </footer>
      </div>
    </div>
  );
}
