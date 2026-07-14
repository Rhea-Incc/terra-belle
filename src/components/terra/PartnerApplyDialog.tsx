"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import type { Vertical, VerticalProject } from "@/lib/verticals-data";

/**
 * PartnerApplyDialog
 *
 * A shared partner application flow used at both the vertical level
 * (whole-vertical partnership) and the project level (a specific
 * project inside a vertical). Renders as an accessible modal with
 * client-side Zod validation and an inline success state.
 *
 * The submission is stored to `localStorage` under the `tb.partner.apps`
 * key so the flow works without a backend; when Lovable Cloud is
 * enabled this can be swapped for a server function without touching
 * call sites.
 */

export type PartnerApplyScope =
  | { kind: "vertical"; vertical: Vertical }
  | { kind: "project"; vertical: Vertical; project: VerticalProject };

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please share your name")
    .max(120, "Keep it under 120 characters"),
  organization: z
    .string()
    .trim()
    .min(2, "Organization is required")
    .max(160, "Keep it under 160 characters"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(254, "Email is too long"),
  role: z
    .string()
    .trim()
    .max(120, "Keep it under 120 characters")
    .optional()
    .or(z.literal("")),
  contribution: z
    .string()
    .refine(
      (v) => ["funding", "research", "operations", "community", "technology", "other"].includes(v),
      "Pick how you'd contribute",
    ),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more (20+ chars)")
    .max(1200, "Please keep it under 1200 characters"),
  consent: z.boolean().refine((v) => v === true, "Please agree to be contacted"),
});

type FormValues = {
  name: string;
  organization: string;
  email: string;
  role: string;
  contribution: string;
  message: string;
  consent: boolean;
};

const empty: FormValues = {
  name: "",
  organization: "",
  email: "",
  role: "",
  contribution: "",
  message: "",
  consent: false,
};

const CONTRIBUTIONS: { value: string; label: string }[] = [
  { value: "funding", label: "Funding" },
  { value: "research", label: "Research" },
  { value: "operations", label: "Operations" },
  { value: "community", label: "Community" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

export function PartnerApplyDialog({
  open,
  onOpenChange,
  scope,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  scope: PartnerApplyScope | null;
}) {
  const [values, setValues] = useState<FormValues>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const title = useMemo(() => {
    if (!scope) return "Partner with Terra Belle";
    if (scope.kind === "vertical") return `Partner with ${scope.vertical.short}`;
    return `Partner on ${scope.project.name}`;
  }, [scope]);

  const color = scope?.vertical.color ?? "#F4B000";

  // Reset when opening for a new scope
  useEffect(() => {
    if (open) {
      setValues(empty);
      setErrors({});
      setStatus("idle");
      const id = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [open, scope?.kind, scope?.vertical.slug, scope?.kind === "project" ? scope.project.id : ""]);

  // Body scroll lock + Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  const setField = <K extends keyof FormValues>(k: K, v: FormValues[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scope) return;
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setStatus("submitting");
    try {
      const record = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        submittedAt: new Date().toISOString(),
        scope:
          scope.kind === "vertical"
            ? { kind: "vertical", vertical: scope.vertical.slug }
            : {
                kind: "project",
                vertical: scope.vertical.slug,
                project: scope.project.id,
                projectName: scope.project.name,
              },
        values: parsed.data,
      };
      const prev = JSON.parse(localStorage.getItem("tb.partner.apps") || "[]");
      prev.push(record);
      localStorage.setItem("tb.partner.apps", JSON.stringify(prev));
      // Small delay so the transition reads intentionally
      await new Promise((r) => setTimeout(r, 400));
      setStatus("success");
    } catch {
      setStatus("idle");
      setErrors((e) => ({ ...e, message: "Something went wrong — please try again." }));
    }
  };

  return (
    <AnimatePresence>
      {open && scope && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-apply-title"
            id="partner-apply-dialog"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[2rem] border border-black/5 bg-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.35)] md:rounded-[2rem]"
          >
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
              style={{ background: color }}
            />

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4 border-b border-black/5 px-7 py-6">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.28em] text-mist">
                  {scope.kind === "vertical" ? "Vertical partnership" : "Project partnership"}
                </div>
                <h2
                  id="partner-apply-title"
                  className="mt-2 font-display text-[1.35rem] leading-tight tracking-tight"
                >
                  {title}
                </h2>
                {scope.kind === "project" && (
                  <div className="mt-1 text-[12px] text-mist">
                    Inside {scope.vertical.short}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close partner application"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 text-mist transition hover:border-black/30 hover:text-ink"
              >
                <span aria-hidden>✕</span>
              </button>
            </div>

            {/* Body */}
            <div className="relative flex-1 overflow-y-auto px-7 py-6">
              {status !== "success" ? (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="grid grid-cols-1 gap-5"
                  aria-describedby="partner-apply-desc"
                >
                  <p id="partner-apply-desc" className="text-[13px] text-mist">
                    Tell us who you are and how you'd move this work forward. We read every note.
                  </p>

                  <Field
                    label="Full name"
                    error={errors.name}
                    id="pa-name"
                    required
                  >
                    <input
                      ref={firstFieldRef}
                      id="pa-name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => setField("name", e.target.value)}
                      className={inputCls(!!errors.name)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "pa-name-err" : undefined}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Organization" error={errors.organization} id="pa-org" required>
                      <input
                        id="pa-org"
                        type="text"
                        autoComplete="organization"
                        value={values.organization}
                        onChange={(e) => setField("organization", e.target.value)}
                        className={inputCls(!!errors.organization)}
                        aria-invalid={!!errors.organization}
                      />
                    </Field>
                    <Field label="Role" error={errors.role} id="pa-role">
                      <input
                        id="pa-role"
                        type="text"
                        autoComplete="organization-title"
                        value={values.role}
                        onChange={(e) => setField("role", e.target.value)}
                        className={inputCls(!!errors.role)}
                      />
                    </Field>
                  </div>

                  <Field label="Email" error={errors.email} id="pa-email" required>
                    <input
                      id="pa-email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className={inputCls(!!errors.email)}
                      aria-invalid={!!errors.email}
                    />
                  </Field>

                  <Field
                    label="How you'd contribute"
                    error={errors.contribution}
                    id="pa-contrib"
                    required
                  >
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Contribution">
                      {CONTRIBUTIONS.map((c) => {
                        const selected = values.contribution === c.value;
                        return (
                          <button
                            key={c.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setField("contribution", c.value)}
                            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                              selected
                                ? "border-ink bg-ink text-white"
                                : "border-black/10 bg-white/70 text-ink/80 hover:border-black/25"
                            }`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  <Field label="What you'd like to bring" error={errors.message} id="pa-msg" required>
                    <textarea
                      id="pa-msg"
                      rows={4}
                      value={values.message}
                      onChange={(e) => setField("message", e.target.value)}
                      className={`${inputCls(!!errors.message)} resize-y`}
                      aria-invalid={!!errors.message}
                      maxLength={1200}
                    />
                    <div className="mt-1 text-right text-[11px] text-mist">
                      {values.message.length}/1200
                    </div>
                  </Field>

                  <label className="flex items-start gap-3 text-[12.5px] text-ink/80">
                    <input
                      type="checkbox"
                      checked={values.consent}
                      onChange={(e) => setField("consent", e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-ink"
                      aria-invalid={!!errors.consent}
                    />
                    <span>
                      I agree to be contacted about this partnership. We won't share your details.
                    </span>
                  </label>
                  {errors.consent && (
                    <div className="-mt-3 text-[12px] text-red-600">{errors.consent}</div>
                  )}

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="text-[12.5px] text-mist hover:text-ink"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      data-magnetic
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-6 py-3 text-[12.5px] font-medium text-white transition-all duration-300 hover:shadow-[0_22px_60px_-15px_rgba(244,176,0,0.6)] disabled:opacity-60"
                    >
                      <span className="relative z-10">
                        {status === "submitting" ? "Sending…" : "Send application"}
                      </span>
                      <span className="relative z-10 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold via-green to-earth transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col items-center py-6 text-center"
                  data-partner-success
                >
                  <motion.span
                    aria-hidden
                    className="grid h-16 w-16 place-items-center rounded-full"
                    style={{ background: color + "22", color }}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 12.5l5 5L20 6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.span>
                  <h3 className="mt-6 font-display text-[1.4rem] leading-tight tracking-tight">
                    Application received
                  </h3>
                  <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-mist">
                    Thank you for reaching out. A steward from{" "}
                    <span className="text-ink">{scope.vertical.short}</span> will respond within a
                    few working days.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-2.5 text-[12.5px] font-medium backdrop-blur transition hover:border-black/25"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setValues(empty);
                        setStatus("idle");
                        window.setTimeout(() => firstFieldRef.current?.focus(), 40);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-medium text-white transition hover:shadow-[0_18px_50px_-20px_rgba(244,176,0,0.55)]"
                    >
                      Submit another
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] uppercase tracking-[0.24em] text-mist"
      >
        {label}
        {required && <span aria-hidden className="ml-1 text-ink/60">*</span>}
      </label>
      {children}
      {error && (
        <div id={`${id}-err`} className="mt-1.5 text-[12px] text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-xl border bg-white/80 px-4 py-2.5 text-[14px] text-ink placeholder:text-mist/60 outline-none transition focus:border-ink focus:bg-white ${
    hasError ? "border-red-400" : "border-black/10 hover:border-black/25"
  }`;
}
