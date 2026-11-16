"use client";
import { useState } from "react";
import type { Objetivo, Plano, Turma } from "@/types/workspace";

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
  // simula a IA com setTimeout e um texto montado com o perfil da turma
  const generate = () => {
    if (!turma) {
      setError("Cadastre uma turma antes de criar um plano.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      // título = primeira frase do material (máx. 70 caracteres)
      const tema =
        material.trim().split(/[.\n]/)[0].slice(0, 70) || "Novo planejamento";
      onCreate({
        id: Date.now(),
        turmaId,
        titulo: tema,
        material: material.trim(),
        objetivo,
        status: "Rascunho",
        atualizado: new Date().toISOString().slice(0, 10),
        secoes: {
          abertura: `Apresente ${tema.toLowerCase()} por meio de uma pergunta ligada a ${turma.interesses.toLowerCase()}. Convide a turma a compartilhar o que já sabe.`,
          desenvolvimento: `Retome o conteúdo-base do RCO e proponha uma atividade em grupos. Considere esta dificuldade observada: ${turma.dificuldades}. Ajuste a profundidade conforme o objetivo de ${objetivo.toLowerCase()}.`,
          fechamento:
            "Peça uma síntese breve: o que aprenderam, qual dúvida permanece e um exemplo do cotidiano em que o conteúdo aparece.",
        },
      });
      setLoading(false);
    }, 900);
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
              ✦ Nesta Sprint 1, a sugestão é demonstrativa e segue um modelo
              fixo. A integração real com IA está prevista para a Sprint 2.
            </div>
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
                onClick={generate}
                disabled={loading}
              >
                {loading
                  ? `Preparando proposta para ${turma?.nome}...`
                  : "Gerar sugestão demonstrativa →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
