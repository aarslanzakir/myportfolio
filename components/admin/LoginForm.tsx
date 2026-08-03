"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Server component re-runs and swaps in the dashboard
        router.refresh();
        return;
      }

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Login failed.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-accent-300 via-accent-400 to-ember-400 text-ink-950">
            <Icon name="shield" className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold text-mist-50">Admin access</h1>
          <p className="mt-2 text-sm text-mist-400">
            Sign in to manage your projects.
          </p>
        </div>

        <form onSubmit={submit} className="glass rounded-3xl p-6">
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-medium tracking-wide text-mist-400 uppercase"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            autoComplete="current-password"
            placeholder="••••••••••••"
            className="w-full rounded-xl border border-white/[0.09] bg-ink-900/70 px-4 py-3 text-sm text-mist-50 placeholder:text-mist-500 focus:border-accent-300/60 focus:outline-none"
          />

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-6 py-3.5 text-sm font-medium text-ink-950 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-mist-500">
          Password is set by <code className="text-mist-400">ADMIN_PASSWORD</code> in
          your <code className="text-mist-400">.env.local</code> file.
        </p>
      </div>
    </div>
  );
}
