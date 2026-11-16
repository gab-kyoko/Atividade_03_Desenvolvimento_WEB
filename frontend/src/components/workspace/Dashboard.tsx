import type { Plano, Turma } from "@/types/workspace";
import { Card } from "@/components/ui/Card";

export function Dashboard({
  turmas,
  planos,
  onNew,
  onOpen,
}: {
  turmas: Turma[];
  planos: Plano[];
  onNew: () => void;
  onOpen: (id: number) => void;
}) {
  // só os rascunhos
  const drafts = planos.filter((p) => p.status === "Rascunho");
  // ano e mês atual, ex.: 2026-11
  const month = new Date().toISOString().slice(0, 7);
  // aplicados neste mês
  const applied = planos.filter(
    (p) => p.status === "Aplicado" && p.aplicadoEm?.startsWith(month),
  ).length;
  return (
    <>
      {/* boas-vindas */}
      <section className="welcome">
        <div>
          <span className="eyebrow">PLANEJAMENTO COM AUTONOMIA</span>
          <h1>
            Bom ter você por aqui.
            <br />
            <em>Vamos continuar?</em>
          </h1>
          <p>Retome uma ideia ou prepare uma nova aula em poucos passos.</p>
          <button className="primary-action" onClick={onNew}>
            + Criar Novo Plano Adaptado
          </button>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <span>✳</span>
        </div>
      </section>
      {/* cards com os números */}
      <section className="summary-grid" aria-label="Resumo">
        <Card>
          <span className="metric-label">Turmas ativas</span>
          <strong>{String(turmas.length).padStart(2, "0")}</strong>
          <small>perfis cadastrados</small>
        </Card>
        <Card>
          <span className="metric-label">Planos em rascunho</span>
          <strong>{String(drafts.length).padStart(2, "0")}</strong>
          <small>para retomar</small>
        </Card>
        <Card>
          <span className="metric-label">Aplicados no mês</span>
          <strong>{String(applied).padStart(2, "0")}</strong>
          <small>aulas realizadas</small>
        </Card>
      </section>
      {/* rascunhos recentes (no máximo 3) */}
      <section className="content-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">ACESSO RÁPIDO</span>
            <h2>Rascunhos recentes</h2>
            <p>Continue de onde parou.</p>
          </div>
        </div>
        <div className="draft-list">
          {drafts.slice(0, 3).map((plan) => {
            // acha a turma do plano pra mostrar nome e disciplina
            const turma = turmas.find((t) => t.id === plan.turmaId);
            return (
              <button
                className="draft-row"
                key={plan.id}
                onClick={() => onOpen(plan.id)}
              >
                <span className="draft-symbol">▤</span>
                <span className="draft-copy">
                  <strong>{plan.titulo}</strong>
                  <small>
                    {turma?.nome} · {turma?.disciplina}
                  </small>
                </span>
                <span className="status draft">Rascunho</span>
                <span aria-hidden="true">↗</span>
              </button>
            );
          })}
          {/* aviso quando não tem rascunho */}
          {!drafts.length && (
            <Card>Não há rascunhos. Crie um plano para começar.</Card>
          )}
        </div>
      </section>
    </>
  );
}
