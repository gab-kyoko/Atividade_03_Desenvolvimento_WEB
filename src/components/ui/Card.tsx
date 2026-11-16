import type { ReactNode } from "react";

// caixinha reutilizada nas telas
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[22px] border border-borda/45 bg-white/70 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
