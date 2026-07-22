import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Terra Belle Foundation" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const check = useServerFn(checkIsAdmin);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "role"],
    queryFn: () => check(),
    staleTime: 60_000,
  });
  const [email, setEmail] = useState<string | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-mist text-sm">Loading admin…</div>;
  }
  if (error || (!data?.isAdmin && !data?.isEditor)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-2xl">Access restricted</h1>
          <p className="mt-3 text-sm text-mist">Your account doesn't have admin access.</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="mt-6 rounded-full border border-black/10 px-5 py-2 text-[12.5px]"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const tabs: { to: string; label: string; exact?: boolean }[] = [
    { to: "/admin", label: "Overview", exact: true },
    { to: "/admin/applications", label: "Applications" },
    { to: "/admin/verticals", label: "Verticals" },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-[1rem] tracking-tight">
              Terra Belle
            </Link>
            <span className="text-[10.5px] uppercase tracking-[0.28em] text-mist">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-mist">
            <span className="hidden sm:inline">{email}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
              className="rounded-full border border-black/10 px-3 py-1.5 hover:border-black/25 hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {tabs.map((t) => {
            const active = t.exact ? path === t.to : path.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to as any}
                className={`rounded-full px-4 py-1.5 text-[12.5px] transition ${
                  active ? "bg-ink text-white" : "text-ink/70 hover:bg-black/5"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
