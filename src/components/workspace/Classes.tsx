"use client";
import { useState, type FormEvent } from "react";
import type { Turma } from "@/types/workspace";
import { Card } from "@/components/ui/Card";

// formulário vazio
const blank = {
  nome: "",
  disciplina: "",
  alunos: "",
  dominios: "",
  dificuldades: "",
  interesses: "",
};
export function Classes({
  turmas,
  onSave,
}: {
  turmas: Turma[];
  onSave: (turma: Turma) => void;
}) {
  // turma sendo editada (null = cadastro novo)
  const [editing, setEditing] = useState<Turma | null>(null);
  // controla o modal
  const [open, setOpen] = useState(false);
  // alunos fica string por causa do input
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  // abre o modal, já preenchido se for edição
  const show = (turma?: Turma) => {
    setEditing(turma ?? null);
    setForm(turma ? { ...turma, alunos: String(turma.alunos) } : blank);
    setError("");
    setOpen(true);
  };
  // valida tudo antes de salvar
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (
      Object.values(form).some((v) => !String(v).trim()) ||
      Number(form.alunos) < 1
    ) {
      setError("Preencha todos os campos e informe a quantidade de alunos.");
      return;
    }
    // mantém o id se for edição
    onSave({
      ...form,
      alunos: Number(form.alunos),
      id: editing?.id ?? Date.now(),
    });
    setOpen(false);
  };
  return (
    <>
      {/* cabeçalho com o botão de cadastrar */}
      <div className="section-title">
        <div>
          <span className="eyebrow">CONTEXTO DA SALA</span>
          <h1>Minhas Turmas</h1>
          <p>Um perfil breve ajuda a retomar o que importa em cada aula.</p>
        </div>
        <button className="primary-action" onClick={() => show()}>
          + Cadastrar turma
        </button>
      </div>
      {/* cards das turmas */}
      <div className="class-grid">
        {turmas.map((turma) => (
          <Card key={turma.id}>
            <div className="class-card-head">
              <span className="class-icon">▦</span>
              <button className="link-action" onClick={() => show(turma)}>
                Editar ↗
              </button>
            </div>
            <h2>{turma.nome}</h2>
            <p className="muted">
              {turma.disciplina} · {turma.alunos} alunos
            </p>
            <div className="class-detail">
              <strong>Já dominam</strong>
              <p>{turma.dominios}</p>
            </div>
            <div className="class-detail">
              <strong>Dificuldades</strong>
              <p>{turma.dificuldades}</p>
            </div>
            <div className="class-detail">
              <strong>Interesses e contexto</strong>
              <p>{turma.interesses}</p>
            </div>
          </Card>
        ))}
      </div>
      {/* modal de cadastro/edição, clicar fora fecha */}
      {open && (
        <div
          className="overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="turma-title"
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">PERFIL DA TURMA</span>
                <h2 id="turma-title">
                  {editing ? "Editar turma" : "Nova turma"}
                </h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fechar">
                ×
              </button>
            </div>
            <form onSubmit={submit} className="form-stack" noValidate>
              <div className="form-row">
                <label>
                  Turma
                  <input
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Ex.: 7º Ano B"
                  />
                </label>
                <label>
                  Disciplina
                  <input
                    value={form.disciplina}
                    onChange={(e) =>
                      setForm({ ...form, disciplina: e.target.value })
                    }
                    placeholder="Ex.: Matemática"
                  />
                </label>
              </div>
              <label>
                Número de alunos
                <input
                  type="number"
                  min="1"
                  value={form.alunos}
                  onChange={(e) => setForm({ ...form, alunos: e.target.value })}
                />
              </label>
              <label>
                O que a turma já domina
                <textarea
                  rows={2}
                  value={form.dominios}
                  onChange={(e) =>
                    setForm({ ...form, dominios: e.target.value })
                  }
                />
              </label>
              <label>
                Principais dificuldades observadas
                <textarea
                  rows={2}
                  value={form.dificuldades}
                  onChange={(e) =>
                    setForm({ ...form, dificuldades: e.target.value })
                  }
                />
              </label>
              <label>
                Interesses e contexto da turma
                <textarea
                  rows={2}
                  value={form.interesses}
                  onChange={(e) =>
                    setForm({ ...form, interesses: e.target.value })
                  }
                />
              </label>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button className="primary-action" type="submit">
                Salvar turma
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
