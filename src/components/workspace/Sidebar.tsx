import type { Tela } from "@/types/workspace";

// itens do menu lateral
const itens: { id: Tela; label: string; icon: string }[] = [
  { id: "inicio", label: "Início", icon: "⌂" },
  { id: "turmas", label: "Minhas Turmas", icon: "▦" },
  { id: "novo", label: "Novo Planejamento", icon: "+" },
  { id: "historico", label: "Histórico", icon: "◷" },
];

export function Sidebar({
  tela,
  onNavigate,
}: {
  tela: Tela;
  onNavigate: (tela: Tela) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        Entrelinha<span>✳</span>
        <small>ESPAÇO DOCENTE</small>
      </div>
      <nav aria-label="Navegação principal">
        {/* um botão por item (Novo continua marcado quando está no editor) */}
        {itens.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${tela === item.id || (tela === "editor" && item.id === "novo") ? "selected" : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-current={tela === item.id ? "page" : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span>✳</span>
        <p>Mais espaço para ensinar do seu jeito.</p>
        <small>Sprint 1 · demonstração</small>
      </div>
    </aside>
  );
}
