import { Adaptacao } from "@/types/adaptacao";
import { useState, type FormEvent } from "react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Props = {
  onSubmit: (dados: Omit<Adaptacao, "id">) => void; // vem do hook, via page.tsx
};

export function AdaptacaoForm({ onSubmit }: Props) {
  // campos do formulário
  const [values, setValues] = useState({
    turma: "",
    conteudoBase: "",
    dificuldade: "",
    adaptacao: "",
  });
  // erro de cada campo
  const [errors, setErrors] = useState<Record<string, string>>({});
  // aviso de sucesso
  const [saved, setSaved] = useState(false);
  // true enquanto a 'IA' pensa
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  // atualiza o campo e limpa o erro dele
  const update = (key: keyof typeof values, value: string) => {
    setValues((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: "" }));
    setSaved(false);
  };
  // todos os campos são obrigatórios
  const save = (event: FormEvent) => {
    event.preventDefault();
    const next = Object.fromEntries(
      Object.entries(values)
        .filter(([, value]) => !value.trim())
        .map(([key]) => [key, "Este campo é obrigatório."]),
    );
    setErrors(next);
    if (Object.keys(next).length) return;
    // manda os dados já sem espaços sobrando
    onSubmit(
      Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value.trim()]),
      ) as Omit<Adaptacao, "id">,
    );
    setValues({ turma: "", conteudoBase: "", dificuldade: "", adaptacao: "" });
    setSuggestion("");
    setSaved(true);
  };
  // sugestão simulada, precisa de conteúdo e observação
  const suggest = () => {
    if (!values.dificuldade.trim() || !values.conteudoBase.trim()) {
      setErrors((old) => ({
        ...old,
        conteudoBase: !values.conteudoBase.trim()
          ? "Informe o conteúdo para receber uma ideia."
          : "",
        dificuldade: !values.dificuldade.trim()
          ? "Descreva a necessidade observada."
          : "",
      }));
      return;
    }
    setLoading(true);
    setSuggestion("");
    // delay só pra parecer que está processando
    window.setTimeout(() => {
      setSuggestion(
        `Ideia demonstrativa: comece com uma conversa sobre ${values.conteudoBase.toLowerCase()} a partir de exemplos próximos da turma; depois proponha uma atividade em grupos para explorar a dificuldade descrita. Revise a proposta antes de usar.`,
      );
      setLoading(false);
    }, 1000);
  };
  return (
    <Card>
      <form onSubmit={save} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="turma"
            label="Turma"
            placeholder="Ex.: 7º B"
            value={values.turma}
            onChange={(e) => update("turma", e.target.value)}
            erro={errors.turma}
          />
          <Field
            id="conteudo"
            label="Conteúdo base"
            placeholder="Ex.: Frações equivalentes"
            value={values.conteudoBase}
            onChange={(e) => update("conteudoBase", e.target.value)}
            erro={errors.conteudoBase}
          />
        </div>
        <Field
          id="dificuldade"
          label="O que você observou na turma?"
          multiline
          placeholder="Conte sobre os interesses, conhecimentos prévios ou dificuldades..."
          value={values.dificuldade}
          onChange={(e) => update("dificuldade", e.target.value)}
          erro={errors.dificuldade}
        />
        <Field
          id="adaptacao"
          label="Como você pretende adaptar a aula?"
          multiline
          placeholder="Descreva o recurso, atividade ou mudança no planejamento..."
          value={values.adaptacao}
          onChange={(e) => update("adaptacao", e.target.value)}
          erro={errors.adaptacao}
        />
        {/* caixa com a sugestão */}
        {suggestion && (
          <div
            className="rounded-xl border border-destaque/60 bg-destaque/15 p-4 text-sm leading-relaxed"
            role="status"
          >
            <strong className="block mb-1">Sugestão simulada</strong>
            {suggestion}
            <button
              type="button"
              className="mt-3 block font-semibold underline"
              onClick={() => update("adaptacao", suggestion)}
            >
              Usar como rascunho
            </button>
          </div>
        )}
        {/* aviso de sucesso */}
        {saved && (
          <p
            className="rounded-xl bg-primaria/10 px-4 py-3 text-sm text-primaria"
            role="status"
          >
            ✓ Adaptação adicionada à lista desta sessão.
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-borda/35 pt-5">
          <button
            type="button"
            onClick={suggest}
            disabled={loading}
            className="rounded-xl border border-primaria px-5 py-2.5 text-sm font-semibold text-primaria transition hover:bg-primaria/10 disabled:opacity-50"
          >
            {loading ? "Preparando ideia..." : "✦ Sugerir ideia (simulação)"}
          </button>
          <Button type="submit">
            Salvar adaptação <span aria-hidden="true">↗</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
