import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { VERTICALS } from "@/lib/verticals-data";

export default defineTool({
  name: "get_vertical",
  title: "Get vertical details",
  description:
    "Return the full public detail for one Terra Belle vertical: mission, vision, goals, drives, projects, phased cycle, projected impact metrics, and aligned partner institutions.",
  inputSchema: {
    slug: z
      .string()
      .min(1)
      .describe("Vertical slug, e.g. 'web3-mrv', 'hydro-aviation', 'wildtracks'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const v = VERTICALS.find((x) => x.slug === slug);
    if (!v) {
      return {
        content: [
          {
            type: "text",
            text: `No vertical found for slug '${slug}'. Use list_verticals to see available slugs.`,
          },
        ],
        isError: true,
      };
    }
    const payload = {
      slug: v.slug,
      title: v.title,
      category: v.category,
      eyebrow: v.eyebrow,
      summary: v.summary,
      mission: v.mission,
      vision: v.vision,
      goals: v.goals,
      drives: v.drives,
      projects: v.projects,
      metrics: v.metrics,
      phases: v.phases,
      partners: v.partners,
      bridges: v.bridges,
      url: `https://terra-belle.lovable.app/verticals/${v.slug}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
