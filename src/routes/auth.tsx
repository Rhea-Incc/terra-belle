import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Terra Belle Foundation" },
      { name: "description", content: "Sign in to access the Terra Belle admin portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/admin",
            data: { full_name: name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.3)]">
        <Link to="/" className="text-[11px] uppercase tracking-[0.28em] text-mist hover:text-ink">
          ← Terra Belle
        </Link>
        <h1 className="mt-6 font-display text-[1.8rem] leading-tight tracking-tight">
          {mode === "signin" ? "Sign in" : "Create admin account"}
        </h1>
        <p className="mt-2 text-[13px] text-mist">
          {mode === "signin"
            ? "Access the Terra Belle admin portal."
            : "The first account created becomes admin."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          {mode === "signup" && (
            <label className="grid gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-mist">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[14px] outline-none focus:border-ink"
              />
            </label>
          )}
          <label className="grid gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.2em] text-mist">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[14px] outline-none focus:border-ink"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.2em] text-mist">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[14px] outline-none focus:border-ink"
            />
          </label>

          {err && <div className="rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{err}</div>}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-6 text-[12.5px] text-mist hover:text-ink"
        >
          {mode === "signin" ? "No account yet? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
