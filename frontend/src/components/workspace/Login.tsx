"use client";
import { useState } from "react";
import { apiRequest } from "@/services/api";

export function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<{ access_token: string }>(register ? "/auth/register" : "/auth/login", "", "POST", { email, password });
      onLogin(result.access_token);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="login-screen">
    <form className="wizard-panel login-form" onSubmit={(event) => void submit(event)}>
      <img src="/entrelinhas-logo.png" alt="Entrelinhas" width="260" height="87" />
      <h1>{register ? "Criar conta" : "Entrar"}</h1>
      <label className="form-label">E-mail<input type="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>
      <label className="form-label">Senha<input type="password" required minLength={8} value={password} onChange={event => setPassword(event.target.value)} /></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="primary-action" disabled={loading}>{loading ? "Aguarde..." : register ? "Cadastrar" : "Entrar"}</button>
      <button type="button" className="link-action" onClick={() => { setRegister(!register); setError(""); }}>
        {register ? "Já tenho conta" : "Criar uma conta"}
      </button>
    </form>
  </main>;
}
