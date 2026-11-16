"use client";
import { useState } from "react";
import type { Objetivo, Plano, Turma } from "@/types/workspace";

type SugestaoDaIa = Pick<Plano, "titulo" | "secoes">;

export function PlanWizard({
  turmas,
  onCreate,
}: {
  turmas: Turma[];
  onCreate: (plano: Plano) => void;
}) {
  // etapa atual (1 a 3)
  const [step, setStep] = useState(1);
  // começa na primeira turma
  const [turmaId, setTurmaId] = useState(turmas[0]?.id ?? 0);
  const [material, setMaterial] = useState("");
  const [objetivo, setObjetivo] = useState<Objetivo>("Contextualizar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // turma selecionada
  const turma = turmas.find((t) => t.id === turmaId);
  const generate = async () => {
    if (!turma) {
      setError("Cadastre uma turma antes de criar um plano.");
      return;
    }
    if (material.trim().length < 10) {
      setError("Descreva o conteúdo-base com pelo menos 10 caracteres.");
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!apiUrl) {
      setError("Configure NEXT_PUBLIC_API_URL para usar a sugestão por IA.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}/api/v1/planos/sugerir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turma, material: material.trim(), objetivo }),
      });
      const body = (await response.json()) as SugestaoDaIa | { detail?: string };
      if (!response.ok || !("secoes" in body)) {
        throw new Error("detail" in body ? body.detail : "Não foi possível gerar a sugestão.");
      }
      onCreate({
        id: Date.now(),
        turmaId,
        titulo: body.titulo,
        material: material.trim(),
        objetivo,
        status: "Rascunho",
        atualizado: new Date().toISOString().slice(0, 10),
        secoes: body.secoes,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível acessar a IA.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="wizard">
      <div className="section-title">
        <div>
          <span className="eyebrow">UM PASSO DE CADA VEZ</span>
          <h1>Novo Planejamento</h1>
          <p>Três etapas curtas para organizar sua proposta.</p>
        </div>
      </div>
      {/* indicador das etapas */}
      <div className="stepper" aria-label="Etapas do planejamento">
        {["Contexto", "Material e objetivo", "Sugestão"].map((name, index) => (
          <div
            key={name}
            className={`step ${step === index + 1 ? "current" : ""} ${step > index + 1 ? "done" : ""}`}
          >
            <span>{index + 1}</span>
            {name}
          </div>
        ))}
      </div>
      <div className="wizard-panel">
        {/* etapa 1: escolher a turma */}
        {step === 1 && (
          <>
            <span className="eyebrow">PASSO 01</span>
            <h2>Para qual turma?</h2>
            <p className="muted">
              Selecione a turma e confira o perfil antes de continuar.
            </p>
            <label className="form-label">
              Turma
              <select
                value={turmaId}
                onChange={(e) => setTurmaId(Number(e.target.value))}
              >
                {turmas.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.nome} · {t.disciplina}
                  </option>
                ))}
              </select>
            </label>
            {turma && (
              <div className="profile-preview">
                <strong>
                  {turma.nome} · {turma.alunos} alunos
                </strong>
                <p>
                  <b>Já dominam:</b> {turma.dominios}
                </p>
                <p>
                  <b>Dificuldades:</b> {turma.dificuldades}
                </p>
                <p>
                  <b>Interesses:</b> {turma.interesses}
                </p>
              </div>
            )}
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <div className="wizard-actions">
              <button
                className="primary-action"
                onClick={() =>
                  turma
                    ? setStep(2)
                    : setError("Cadastre uma turma antes de criar um plano.")
                }
              >
                Continuar →
              </button>
            </div>
          </>
        )}
        {/* etapa 2: material e objetivo */}
        {step === 2 && (
          <>
            <span className="eyebrow">PASSO 02</span>
            <h2>O que você quer adaptar?</h2>
            <p className="muted">
              Cole o tema ou trecho do material do RCO. Você poderá compará-lo
              com o plano.
            </p>
            <label className="form-label">
              Conteúdo-base do RCO
              <textarea
                rows={6}
                value={material}
                onChange={(e) => {
                  setMaterial(e.target.value);
                  setError("");
                }}
                placeholder="Ex.: Frações equivalentes e representação de quantidades..."
              />
            </label>
            <span className="form-label">Qual é seu objetivo?</span>
            <div className="objective-grid">
              {/* um botão por objetivo */}
              {(["Aprofundar", "Reforçar", "Contextualizar"] as Objetivo[]).map(
                (item) => (
                  <button
                    key={item}
                    className={`objective ${objetivo === item ? "active" : ""}`}
                    onClick={() => setObjetivo(item)}
                    aria-pressed={objetivo === item}
                  >
                    <span>
                      {item === "Aprofundar"
                        ? "↗"
                        : item === "Reforçar"
                          ? "◎"
                          : "✳"}
                    </span>
                    <strong>{item}</strong>
                  </button>
                ),
              )}
            </div>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <div className="wizard-actions">
              <button className="secondary-action" onClick={() => setStep(1)}>
                ← Voltar
              </button>
              <button
                className="primary-action"
                onClick={() =>
                  material.trim()
                    ? setStep(3)
                    : setError("Informe o conteúdo-base antes de continuar.")
                }
              >
                Continuar →
              </button>
            </div>
          </>
        )}
        {/* etapa 3: revisar e gerar */}
        {step === 3 && (
          <>
            <span className="eyebrow">PASSO 03</span>
            <h2>Pronto para uma primeira ideia</h2>
            <p className="muted">
              Confira os dados. A proposta será aberta para sua revisão.
            </p>
            <div className="review-box">
              <p>
                <b>Turma:</b> {turma?.nome} · {turma?.disciplina}
              </p>
              <p>
                <b>Objetivo:</b> {objetivo}
              </p>
              <p>
                <b>Material:</b> {material}
              </p>
            </div>
            <div className="simulation-note">
              ✦ A IA propõe uma abertura, um desenvolvimento e um fechamento.
              Revise e personalize o resultado antes de aplicar com a turma.
            </div>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <div className="wizard-actions">
              <button
                className="secondary-action"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                ← Voltar
              </button>
              <button
                className="primary-action"
                onClick={() => void generate()}
                disabled={loading}
              >
                {loading
                  ? `Gerando proposta para ${turma?.nome}...`
                  : "Gerar sugestão com IA →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
