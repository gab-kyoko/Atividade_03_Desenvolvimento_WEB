import type { ChangeEvent } from "react";

type Props = { label: string; erro?: string; multiline?: boolean; id: string; className?: string; placeholder?: string; value: string; onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void };

export function Field({ label, erro, multiline = false, id, className = "", placeholder, value, onChange }: Props) {
  const style = `mt-2 w-full rounded-xl border bg-fundo/45 px-4 py-3 text-texto outline-none transition placeholder:text-texto/45 focus:ring-2 focus:ring-primaria/25 ${erro ? "border-destaque" : "border-borda/60"} ${className}`;
  return <label className="block text-sm font-medium text-texto" htmlFor={id}>{label}
    {multiline ? <textarea id={id} className={style} rows={4} placeholder={placeholder} value={value} onChange={onChange} /> : <input id={id} className={style} placeholder={placeholder} value={value} onChange={onChange} />}
    {erro && <span className="mt-1 block text-xs text-texto" role="alert">{erro}</span>}
  </label>;
}
