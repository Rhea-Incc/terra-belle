import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const schema = z.object({
  scopeKind: z.enum(["vertical", "project"]),
  verticalSlug: z.string().min(1).max(80),
  projectId: z.string().max(80).optional().nullable(),
  projectName: z.string().max(200).optional().nullable(),
  name: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  role: z.string().max(120).optional().nullable(),
  contribution: z.enum(["funding", "research", "operations", "community", "technology", "other"]),
  message: z.string().trim().min(20).max(1200),
});

function serverClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const submitPartnerApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const supabase = serverClient();
    const { error } = await supabase.from("partner_applications").insert({
      scope_kind: data.scopeKind,
      vertical_slug: data.verticalSlug,
      project_id: data.projectId ?? null,
      project_name: data.projectName ?? null,
      name: data.name,
      organization: data.organization,
      email: data.email,
      role: data.role ?? null,
      contribution: data.contribution,
      message: data.message,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
