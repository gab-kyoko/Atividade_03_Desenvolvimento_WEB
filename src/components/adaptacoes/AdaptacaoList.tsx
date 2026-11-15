import { Adaptacao } from "@/types/adaptacao";
import { Card } from "@/components/ui/Card";

type Props = {
  adaptacoes: Adaptacao[];
};

export function AdaptacaoList({ adaptacoes }: Props) {
  if (!adaptacoes.length) return <Card><p className="text-center text-texto/70">Nenhuma adaptação encontrada. Crie a primeira acima.</p></Card>;
  return <div className="grid gap-4 md:grid-cols-2">{adaptacoes.map(item => <Card key={item.id} className="flex flex-col gap-5">
    <div className="flex items-start justify-between gap-3"><div><span className="text-xs font-semibold uppercase tracking-[.16em] text-primaria">Turma {item.turma}</span><h3 className="mt-2 text-xl font-semibold leading-snug">{item.conteudoBase}</h3></div><span className="rounded-full bg-borda/25 px-3 py-1 text-xs">Aula adaptada</span></div>
    <div><span className="text-xs font-semibold uppercase tracking-[.12em] text-texto/55">Necessidade observada</span><p className="mt-1 text-sm leading-relaxed text-texto/80">{item.dificuldade}</p></div>
    <div className="rounded-xl bg-fundo/70 p-4"><span className="text-xs font-semibold uppercase tracking-[.12em] text-primaria">Minha adaptação</span><p className="mt-1 text-sm leading-relaxed">{item.adaptacao}</p></div>
  </Card>)}</div>;
}
