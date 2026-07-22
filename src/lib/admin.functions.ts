import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) {
    const { data: ed } = await supabase.rpc("has_role", { _user_id: userId, _role: "editor" });
    if (!ed) throw new Error("Forbidden");
  }
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const since7d = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const since30d = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

    const [views24, views7, views30, appsTotal, appsNew, topPathsRes, dailyViewsRes] =
      await Promise.all([
        supabaseAdmin.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since24h),
        supabaseAdmin.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since7d),
        supabaseAdmin.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since30d),
        supabaseAdmin.from("partner_applications").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("partner_applications").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabaseAdmin.from("page_views").select("path").gte("created_at", since30d).limit(5000),
        supabaseAdmin.from("page_views").select("created_at").gte("created_at", since30d).limit(20000),
      ]);

    const pathCounts: Record<string, number> = {};
    (topPathsRes.data ?? []).forEach((r: any) => {
      pathCounts[r.path] = (pathCounts[r.path] ?? 0) + 1;
    });
    const topPaths = Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    const daily: Record<string, number> = {};
    (dailyViewsRes.data ?? []).forEach((r: any) => {
      const day = r.created_at.slice(0, 10);
      daily[day] = (daily[day] ?? 0) + 1;
    });
    const series = Object.entries(daily)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([day, count]) => ({ day, count }));

    return {
      views24h: views24.count ?? 0,
      views7d: views7.count ?? 0,
      views30d: views30.count ?? 0,
      appsTotal: appsTotal.count ?? 0,
      appsNew: appsNew.count ?? 0,
      topPaths,
      series,
    };
  });

export const listApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "reviewing", "contacted", "closed"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("partner_applications")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listVerticalsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("verticals").select("*").order("slug");
    return data ?? [];
  });

export const upsertVertical = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        slug: z.string().min(1).max(80),
        title: z.string().max(200).optional().nullable(),
        short: z.string().max(120).optional().nullable(),
        summary: z.string().max(2000).optional().nullable(),
        hero: z.string().max(2000).optional().nullable(),
        mission: z.string().max(2000).optional().nullable(),
        vision: z.string().max(2000).optional().nullable(),
        active: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("verticals").upsert(
      { ...data, updated_at: new Date().toISOString(), updated_by: context.userId },
      { onConflict: "slug" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: admin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const { data: editor } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "editor",
    });
    return { isAdmin: !!admin, isEditor: !!editor, userId: context.userId };
  });
