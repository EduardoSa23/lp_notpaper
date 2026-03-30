"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function DiretoriaLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPath = searchParams.get("next") || "/diretoria";
  const nextPath = requestedPath.startsWith("/") ? requestedPath : "/diretoria";
  const sessionExpired = searchParams.get("session") === "expired";

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Nao foi possivel autenticar.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Erro de conexao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md">
        <Link
          href="/"
          className="w-full rounded-lg shadow-xl bg-[#002073] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00164f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Voltar para o site
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#002073]">Acesso restrito</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Login da Diretoria</h1>
            <p className="mt-3 text-sm text-slate-600">Entre com as credenciais autorizadas para continuar.</p>
          </div>

          {sessionExpired ? (
            <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Sua sessao expirou por inatividade. Entre novamente para continuar.
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Login</span>
              <input
                type="text"
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#002073] focus:ring-2 focus:ring-[#002073]/15"
                placeholder="Digite seu login"
                autoComplete="username"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Senha</span>
              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#002073] focus:ring-2 focus:ring-[#002073]/15"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
            </label>

            {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#002073] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00164f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
