import { defineTool } from "@lovable.dev/mcp-js";

const OVERVIEW = {
  name: "Terra Belle Foundation",
  tagline: "A living regenerative operating system.",
  description:
    "Terra Belle Foundation weaves technology, renewable energy, environmental stewardship, circular economics, AI, finance, education, and sustainable infrastructure into one self-sustaining loop.",
  chapters: [
    { id: "genesis", title: "Genesis" },
    { id: "planet", title: "The Planet" },
    { id: "ecosystem", title: "The Ecosystem" },
    { id: "circularEconomy", title: "The Circular Economy" },
    { id: "impactEngine", title: "The Impact Engine" },
    { id: "collaboration", title: "The Collaboration Network" },
    { id: "future", title: "The Future" },
  ],
  pages: {
    home: "https://terra-belle.lovable.app/",
    planet: "https://terra-belle.lovable.app/planet",
    ecosystem: "https://terra-belle.lovable.app/ecosystem",
    circular: "https://terra-belle.lovable.app/circular",
    impact: "https://terra-belle.lovable.app/impact",
    verticals: "https://terra-belle.lovable.app/verticals",
  },
};

export default defineTool({
  name: "about_terra_belle",
  title: "About Terra Belle Foundation",
  description:
    "Overview of Terra Belle Foundation — its mission, cinematic chapters, and the top-level pages of the digital ecosystem.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(OVERVIEW, null, 2) }],
    structuredContent: OVERVIEW,
  }),
});
