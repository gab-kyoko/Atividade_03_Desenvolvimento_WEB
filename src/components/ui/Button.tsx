import { ButtonHTMLAttributes } from "react";

// Um botão só para o projeto inteiro, evita repetir classes em cada tela.
export function Button({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-xl bg-primaria px-5 py-2.5 font-semibold text-white
        transition hover:opacity-90 disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
