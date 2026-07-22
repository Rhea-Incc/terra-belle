import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listApplications, updateApplicationStatus } from "@/lib/admin.functions";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  component: ApplicationsPage,
});

const STATUSES = ["new", "reviewing", "contacted", "closed"] as const;
type Status = (typeof STATUSES)[number];

function ApplicationsPage() {
  const list = useServerFn(listApplications);
  const update = useServerFn(updateApplicationStatus);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "apps"],
    queryFn: () => list(),
  });

  const mut = useMutation({
    mutationFn: (v: { id: string; status: Status }) => update({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "apps"] }),
  });

  const rows = (data ?? []).filter((r: any) => filter === "all" || r.status === filter);

  return (
    <div className="grid gap-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.6rem] tracking-tight">Partner applications</h1>
          <p className="mt-1 text-[13px] text-mist">All submissions from the partner apply flow.</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-[12px] transition ${
                filter === s ? "bg-ink text-white" : "border border-black/10 text-ink/70 hover:border-black/25"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-black/5 bg-white">
        {isLoading ? (
          <div className="p-6 text-sm text-mist">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-mist">No applications yet.</div>
        ) : (
          <div className="divide-y divide-black/5">
            {rows.map((r: any) => (
              <div key={r.id}>
                <button
                  onClick={() => setOpen(open === r.id ? null : r.id)}
                  className="grid w-full grid-cols-12 items-center gap-3 px-5 py-4 text-left transition hover:bg-black/[0.02]"
                >
                  <div className="col-span-12 sm:col-span-4">
                    <div className="text-[13.5px] font-medium text-ink">{r.name}</div>
                    <div className="text-[11.5px] text-mist">{r.organization}</div>
                  </div>
                  <div className="col-span-6 text-[12px] text-mist sm:col-span-3">{r.email}</div>
                  <div className="col-span-6 text-[12px] sm:col-span-2">
                    <span className="text-mist">
                      {r.scope_kind === "vertical" ? r.vertical_slug : `${r.vertical_slug} · ${r.project_name ?? r.project_id}`}
                    </span>
                  </div>
                  <div className="col-span-6 text-[11px] text-mist sm:col-span-2">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                  <div className="col-span-6 sm:col-span-1">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10.5px] uppercase tracking-wide ${
                      r.status === "new" ? "bg-gold/20 text-gold" :
                      r.status === "reviewing" ? "bg-earth/15 text-earth" :
                      r.status === "contacted" ? "bg-green/15 text-green" :
                      "bg-black/10 text-mist"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </button>
                {open === r.id && (
                  <div className="border-t border-black/5 bg-black/[0.02] px-5 py-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-[0.22em] text-mist">Contribution</div>
                        <div className="mt-1 text-[13px]">{r.contribution}</div>
                        {r.role && (
                          <>
                            <div className="mt-3 text-[10.5px] uppercase tracking-[0.22em] text-mist">Role</div>
                            <div className="mt-1 text-[13px]">{r.role}</div>
                          </>
                        )}
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-[0.22em] text-mist">Message</div>
                        <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-ink/85">{r.message}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] uppercase tracking-[0.22em] text-mist">Move to</span>
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          disabled={r.status === s || mut.isPending}
                          onClick={() => mut.mutate({ id: r.id, status: s })}
                          className="rounded-full border border-black/10 px-3 py-1 text-[11.5px] hover:border-black/30 disabled:opacity-40"
                        >
                          {s}
                        </button>
                      ))}
                      <a
                        href={`mailto:${r.email}`}
                        className="ml-auto rounded-full bg-ink px-3 py-1 text-[11.5px] text-white"
                      >
                        Email →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
