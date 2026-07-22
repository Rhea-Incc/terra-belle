import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listVerticalsAdmin, upsertVertical } from "@/lib/admin.functions";
import { VERTICALS } from "@/lib/verticals-data";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/verticals")({
  component: VerticalsAdmin,
});

type Form = {
  slug: string;
  title: string;
  short: string;
  summary: string;
  hero: string;
  mission: string;
  vision: string;
  active: boolean;
};

function VerticalsAdmin() {
  const list = useServerFn(listVerticalsAdmin);
  const save = useServerFn(upsertVertical);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "verticals"], queryFn: () => list() });
  const [active, setActive] = useState<string>(VERTICALS[0].slug);

  const overrides = useMemo(() => {
    const map: Record<string, any> = {};
    (data ?? []).forEach((r: any) => (map[r.slug] = r));
    return map;
  }, [data]);

  const source = VERTICALS.find((v) => v.slug === active)!;
  const override = overrides[active] ?? {};
  const initial: Form = {
    slug: active,
    title: override.title ?? source.title,
    short: override.short ?? source.short,
    summary: override.summary ?? source.summary,
    hero: override.hero ?? source.hero,
    mission: override.mission ?? source.mission,
    vision: override.vision ?? source.vision,
    active: override.active ?? true,
  };

  const [form, setForm] = useState<Form>(initial);
  // Reset form when tab changes
  const [lastSlug, setLastSlug] = useState(active);
  if (lastSlug !== active) {
    setLastSlug(active);
    setForm(initial);
  }

  const mut = useMutation({
    mutationFn: (v: Form) => save({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "verticals"] }),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border border-black/5 bg-white p-3">
        <div className="px-3 py-2 text-[10.5px] uppercase tracking-[0.24em] text-mist">Verticals</div>
        <div className="grid">
          {VERTICALS.map((v) => (
            <button
              key={v.slug}
              onClick={() => setActive(v.slug)}
              className={`rounded-lg px-3 py-2 text-left text-[13px] transition ${
                active === v.slug ? "bg-ink text-white" : "text-ink/80 hover:bg-black/5"
              }`}
            >
              <div className="truncate">{v.short}</div>
              <div className={`text-[10.5px] ${active === v.slug ? "text-white/70" : "text-mist"}`}>
                {overrides[v.slug] ? "Edited" : "Default"}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[1.4rem] tracking-tight">{source.title}</h1>
            <p className="mt-1 text-[12px] text-mist">Edit the copy displayed on the public vertical page.</p>
          </div>
          <label className="flex items-center gap-2 text-[12px]">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            Active
          </label>
        </div>

        <div className="mt-6 grid gap-4">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inp} />
          </Field>
          <Field label="Short name">
            <input value={form.short} onChange={(e) => setForm((f) => ({ ...f, short: e.target.value }))} className={inp} />
          </Field>
          <Field label="Summary">
            <textarea rows={3} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} className={inp} />
          </Field>
          <Field label="Hero statement">
            <textarea rows={3} value={form.hero} onChange={(e) => setForm((f) => ({ ...f, hero: e.target.value }))} className={inp} />
          </Field>
          <Field label="Mission">
            <textarea rows={3} value={form.mission} onChange={(e) => setForm((f) => ({ ...f, mission: e.target.value }))} className={inp} />
          </Field>
          <Field label="Vision">
            <textarea rows={3} value={form.vision} onChange={(e) => setForm((f) => ({ ...f, vision: e.target.value }))} className={inp} />
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {mut.isSuccess && <span className="text-[12px] text-green">Saved</span>}
          {mut.error && <span className="text-[12px] text-red-600">Save failed</span>}
          <button
            onClick={() => setForm(initial)}
            className="rounded-full border border-black/10 px-4 py-2 text-[12.5px]"
          >
            Reset
          </button>
          <button
            onClick={() => mut.mutate(form)}
            disabled={mut.isPending}
            className="rounded-full bg-ink px-5 py-2 text-[12.5px] text-white disabled:opacity-60"
          >
            {mut.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </section>
    </div>
  );
}

const inp =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-[13.5px] outline-none focus:border-ink";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[10.5px] uppercase tracking-[0.24em] text-mist">{label}</span>
      {children}
    </label>
  );
}
