import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAdminOverview } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const fn = useServerFn(getAdminOverview);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => fn(),
    refetchInterval: 30_000,
  });

  if (isLoading || !data) return <div className="text-mist text-sm">Loading…</div>;

  const stats = [
    { label: "Visits · 24h", value: data.views24h },
    { label: "Visits · 7d", value: data.views7d },
    { label: "Visits · 30d", value: data.views30d },
    { label: "Applications", value: data.appsTotal },
    { label: "New applications", value: data.appsNew },
  ];

  const max = Math.max(1, ...data.series.map((s) => s.count));

  return (
    <div className="grid gap-6">
      <section>
        <h1 className="font-display text-[1.6rem] tracking-tight">Overview</h1>
        <p className="mt-1 text-[13px] text-mist">Live metrics from Terra Belle's visitors and partners.</p>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="text-[10.5px] uppercase tracking-[0.24em] text-mist">{s.label}</div>
            <div className="mt-3 font-display text-[1.8rem] leading-none">{s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <div className="text-[10.5px] uppercase tracking-[0.24em] text-mist">Visits · last 30 days</div>
        <div className="mt-6 flex h-40 items-end gap-1">
          {data.series.length === 0 && <div className="text-sm text-mist">No visits yet.</div>}
          {data.series.map((s) => (
            <div
              key={s.day}
              className="flex-1 rounded-t bg-ink/80 transition hover:bg-ink"
              style={{ height: `${(s.count / max) * 100}%` }}
              title={`${s.day} — ${s.count}`}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <div className="text-[10.5px] uppercase tracking-[0.24em] text-mist">Top pages · 30d</div>
        <ul className="mt-4 divide-y divide-black/5">
          {data.topPaths.length === 0 && <li className="py-3 text-sm text-mist">No data yet.</li>}
          {data.topPaths.map((p) => (
            <li key={p.path} className="flex items-center justify-between gap-4 py-3">
              <span className="truncate text-[13px] text-ink">{p.path}</span>
              <span className="shrink-0 text-[12.5px] text-mist">{p.count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
