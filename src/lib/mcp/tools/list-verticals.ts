import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { VERTICALS, CATEGORIES } from "@/lib/verticals-data";

export default defineTool({
  name: "list_verticals",
  title: "List Terra Belle verticals",
  description:
    "List Terra Belle Foundation's regenerative verticals (MRV & reforestation, hydro-aviation R&D, distributed green energy, direct air removal, green construction, vertical gardens, WildTracks conservation tourism, and more). Optionally filter by category.",
  inputSchema: {
    category: z
      .enum(CATEGORIES as [string, ...string[]])
      .optional()
      .describe("Filter by category. Omit or use 'All' for every vertical."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const items = VERTICALS.filter(
      (v) => !category || category === "All" || v.category === category,
    ).map((v) => ({
      slug: v.slug,
      title: v.title,
      category: v.category,
      eyebrow: v.eyebrow,
      short: v.short,
      summary: v.summary,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { verticals: items },
    };
  },
});
