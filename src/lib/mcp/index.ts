import { defineMcp } from "@lovable.dev/mcp-js";
import aboutTerraBelle from "./tools/about-terra-belle";
import listVerticals from "./tools/list-verticals";
import getVertical from "./tools/get-vertical";

export default defineMcp({
  name: "terra-belle-mcp",
  title: "Terra Belle Foundation MCP",
  version: "0.1.0",
  instructions:
    "Public tools for exploring Terra Belle Foundation's regenerative ecosystem. Use `about_terra_belle` for an overview of the foundation and its cinematic chapters, `list_verticals` (optionally filtered by category) to browse regenerative verticals, and `get_vertical` for a vertical's mission, projects, phased cycle, projected impact metrics, and aligned partners.",
  tools: [aboutTerraBelle, listVerticals, getVertical],
});
