"use client";
import { useState } from "react";
import type { Plano, Secao, Turma } from "@/types/workspace";

// seções fixas do plano, cada uma com uma dica
const sections: { key: Secao; title: string; hint: string }[] = [
  {
    key: "abertura",
    title: "Abertura",
    hint: "Gancho inicial e sensibilização",
  },
  {
    key: "desenvolvimento",
    title: "Desenvolvimento",
    hint: "Explicação e atividade prática",
  },
  {
    key: "fechamento",
    title: "Fechamento",
    hint: "Síntese e avaliação rápida",
  },
];
export function PlanEditor({
  plano,
  turma,
  onSave,
  onBack,
}: {
  plano: Plano;
  turma?: Turma;
  onSave: (plano: Plano) => void;
  onBack: () => void;
}) {
  // cópia editável do plano
  const [draft, setDraft] = useState(plano);
  // mostra ou esconde o painel de referência
  const [reference, setReference] = useState(true);
  // modal de marcar como aplicado
  const [applying, setApplying] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [notice, setNotice] = useState("");
  // atualiza só a seção que mudou
  const update = (key: Secao, value: string) =>
    setDraft((old) => ({ ...old, secoes: { ...old.secoes, [key]: value } }));
  // salva como rascunho ou aplicado, não deixa seção vazia
  const save = (status: Plano["status"]) => {
    if (Object.values(draft.secoes).some((v) => !v.trim())) {
      setNotice("Preencha as três seções antes de salvar.");
      return;
    }
    const saved = {
      ...draft,
      status,
      atualizado: new Date().toISOString().slice(0, 10),
      ...(status === "Aplicado" ? { aplicadoEm: date, observacao: note } : {}),
    };
    onSave(saved);
    setDraft(saved);
    setNotice(
      status === "Aplicado"
        ? "Plano marcado como aplicado."
        : "Rascunho salvo nesta sessão.",
    );
    setApplying(false);
  };
  return (
    <>
      <div className="section-title">
        <div>
          <button className="back-link" onClick={onBack}>
            ← Voltar
          </button>
          <span className="eyebrow">REVISÃO DOCENTE</span>
          <h1>{draft.titulo}</h1>
          <p>
            {turma?.nome} · {turma?.disciplina} · {draft.objetivo}
          </p>
        </div>
        <span
          className={`status ${draft.status === "Aplicado" ? "applied" : "draft"}`}
        >
          {draft.status}
        </span>
      </div>
      {/* referência de um lado, seções editáveis do outro */}
      <div className={`editor-grid ${reference ? "" : "reference-hidden"}`}>
        <aside className="reference-panel">
          <button className="panel-toggle" onClick={() => setReference(false)}>
            Referência <span>← Recolher</span>
          </button>
          <div>
            <span className="eyebrow">MATERIAL ORIGINAL DO RCO</span>
            <p>{draft.material}</p>
          </div>
          <div>
            <span className="eyebrow">PERFIL DA TURMA</span>
            <p>
              <b>Já dominam:</b> {turma?.dominios}
            </p>
            <p>
              <b>Dificuldades:</b> {turma?.dificuldades}
            </p>
            <p>
              <b>Interesses:</b> {turma?.interesses}
            </p>
          </div>
        </aside>
        <div className="editor-main">
          {!reference && (
            <button
              className="secondary-action"
              onClick={() => setReference(true)}
            >
              → Mostrar referência
            </button>
          )}
          {/* uma caixa de texto por seção */}
          {sections.map((section) => (
            <section className="editor-section" key={section.key}>
              <div className="editor-heading">
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.hint}</p>
                </div>
                <button
                  className="link-action"
                  onClick={() => {
                    // texto fixo simulando a regeneração
                    update(
                      section.key,
                      `Ideia demonstrativa para ${section.title.toLowerCase()}: retome ${draft.titulo.toLowerCase()} com exemplos próximos de ${turma?.nome}. Revise e personalize este texto antes de usar.`,
                    );
                    setNotice(
                      "Seção substituída por uma sugestão demonstrativa.",
                    );
                  }}
                >
                  ↻ Regenerar seção
                </button>
              </div>
              <textarea
                aria-label={section.title}
                rows={5}
                value={draft.secoes[section.key]}
                onChange={(e) => update(section.key, e.target.value)}
              />
            </section>
          ))}
        </div>
      </div>
      {/* barra de ações fixa */}
      <div className="editor-bar">
        {notice && (
          <span role="status" className="editor-notice">
            {notice}
          </span>
        )}
        <button className="secondary-action" onClick={() => setApplying(true)}>
          Marcar como Aplicado
        </button>
        <button className="primary-action" onClick={() => save("Rascunho")}>
          Salvar Rascunho
        </button>
      </div>
      {/* modal pra registrar data e observação */}
      {applying && (
        <div
          className="overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setApplying(false);
          }}
        >
          <section
            className="modal small-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-title"
          >
            <div className="modal-head">
              <h2 id="apply-title">Registrar aplicação</h2>
              <button onClick={() => setApplying(false)} aria-label="Fechar">
                ×
              </button>
            </div>
            <div className="form-stack">
              <label>
                Data da aula
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                Observação pós-aula (opcional)
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="O que funcionou?"
                />
              </label>
              <button
                className="primary-action"
                onClick={() =>
                  date
                    ? save("Aplicado")
                    : setNotice("Selecione a data da aula.")
                }
              >
                Confirmar aplicação
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
