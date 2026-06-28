import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/terra/PageShell";
import { Section, Reveal } from "@/components/terra/Section";
import { Tilt } from "@/components/terra/Interactive";
import {
  LeafIcon,
  SunIcon,
  WaterIcon,
  WindIcon,
  NetworkIcon,
  ChartIcon,
} from "@/components/terra/Icons";


const VERTICALS = [
  {
    id: "web3-mrv",
    title: "Web3 Carbon Credit MRV & Reforestation",
    eyebrow: "Verified Regeneration",
    color: "#0DBB63",
    Icon: LeafIcon,
    summary:
      "On-chain Measurement, Reporting and Verification for high-integrity carbon credits — pairing satellite + LiDAR biomass models with smart-contract issuance so every tonne of CO₂ removed is traceable, audit-grade, and double-counting proof.",
    points: [
      "Tokenised carbon credits backed by parcel-level reforestation",
      "Open MRV pipeline auditable by partners and the public",
      "Community-owned reforestation sites with revenue share",
    ],
  },
  {
    id: "hydro-aviation",
    title: "Hydroelectric-Powered Airplane Engines",
    eyebrow: "Aerospace R&D",
    color: "#6B8CF7",
    Icon: WindIcon,
    summary:
      "Long-horizon research into liquid-hydrogen turbines and hydro-electrically produced green H₂ fuel chains — designing the pathway to zero-emission flight by powering electrolysis from renewable hydroelectric grids.",
    points: [
      "Green-hydrogen turbine prototypes for regional aviation",
      "Hydroelectric → electrolysis → cryogenic fuel supply chain",
      "Co-development with university aerospace labs",
    ],
  },
  {
    id: "green-energy",
    title: "Distributed Green Energy",
    eyebrow: "Renewable Infrastructure",
    color: "#F4B000",
    Icon: SunIcon,
    summary:
      "Community-scale solar, micro-hydro and storage networks deployed where they multiply impact — electrifying rural economies while feeding surplus generation back into national grids.",
    points: [
      "Microgrid deployments with local cooperative ownership",
      "Battery and pumped-storage to firm intermittent supply",
      "Carbon-aware load scheduling powered by the AI layer",
    ],
  },
  {
    id: "dac",
    title: "Direct Air Carbon Removal",
    eyebrow: "Atmospheric Repair",
    color: "#0E46B8",
    Icon: NetworkIcon,
    summary:
      "Modular direct-air-capture units paired with mineralisation and bio-sequestration to remove legacy CO₂ from the atmosphere — engineered to be powered exclusively by surplus renewable energy.",
    points: [
      "Sorbent-based DAC with mineralised, permanent storage",
      "Co-located with renewables to use otherwise-curtailed power",
      "Removed tonnes feed the same MRV registry as forestry",
    ],
  },
  {
    id: "carbon-mortar",
    title: "Green Construction & Carbon Mortar",
    eyebrow: "Built Environment",
    color: "#0DBB63",
    Icon: ChartIcon,
    summary:
      "Low-clinker cement, carbon-cured mortars and bio-aggregate composites that sequester CO₂ inside the buildings we already need — turning the construction sector from the world's largest emitter into a carbon sink.",
    points: [
      "Carbon-mineralising mortar and CO₂-cured precast",
      "Hempcrete, mycelium and bio-composite structural panels",
      "Embodied-carbon labelling integrated with the MRV stack",
    ],
  },
  {
    id: "vertical-gardens",
    title: "Vertical Gardens & Urban Forestry",
    eyebrow: "Living Architecture",
    color: "#0DBB63",
    Icon: LeafIcon,
    summary:
      "Façade-integrated vertical gardens, rooftop food forests and modular living walls that cool cities, clean air, restore pollinators and shorten food supply chains — biology returned to the centre of urban design.",
    points: [
      "Modular hydroponic and soil-substrate wall systems",
      "Native-species planting plans designed for local pollinators",
      "Cooling, air-quality and biodiversity gains measured live",
    ],
  },
  {
    id: "wildtracks",
    title: "Conservation Tourism · WildTracks",
    eyebrow: "Partnership",
    color: "#6B8CF7",
    Icon: WaterIcon,
    summary:
      "In partnership with WildTracks, regenerative conservation-tourism experiences that channel visitor revenue directly into rewilding, primate and manatee rehabilitation, and protected-area stewardship in Belize and beyond.",
    points: [
      "Low-impact lodges co-managed with conservation partners",
      "Visitor fees fund rehabilitation of rescued wildlife",
      "Researcher and volunteer placements alongside guests",
    ],
  },
];

export const Route = createFileRoute("/verticals")({
  head: () => ({
    meta: [
      { title: "Verticals — Terra Belle Foundation" },
      {
        name: "description",
        content:
          "Web3 carbon MRV and reforestation, hydroelectric green-hydrogen aviation, distributed renewables, direct air carbon removal, green construction and carbon mortar, vertical gardens, and conservation tourism with WildTracks.",
      },
      { property: "og:title", content: "Verticals — Terra Belle Foundation" },
      {
        property: "og:description",
        content:
          "The operating facets of Terra Belle — every vertical is a node in one regenerative loop.",
      },
    ],
  }),
  component: VerticalsPage,
});

function VerticalsPage() {
  return (
    <PageShell
      eyebrow="Operating Facets"
      title="The Verticals"
      intro="Each vertical is an independent engine of regeneration — and a node in the same circular system. Capital, knowledge, energy and carbon flow between them so progress in one accelerates progress in all."
    >
      <Section id="verticals-grid">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((v, i) => {
            const Icon = v.Icon;
            return (
              <Reveal key={v.id} delay={(i % 3) * 0.08}>
                <Tilt>
                  <article
                    id={v.id}
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white/85 p-8 backdrop-blur transition-shadow duration-500 hover:shadow-[0_30px_70px_-30px_rgba(17,17,17,0.25)]"
                  >
                    <div
                      aria-hidden
                      className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                      style={{ background: v.color }}
                    />
                    <div className="relative flex items-center gap-3">
                      <span
                        className="grid h-11 w-11 place-items-center rounded-2xl"
                        style={{ background: v.color + "18" }}
                      >
                        <Icon size={22} color={v.color} />
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.24em] text-mist">{v.eyebrow}</span>
                    </div>

                    <h2 className="relative mt-6 font-display text-[clamp(1.4rem,2.2vw,1.8rem)] leading-tight tracking-tight">
                      {v.title}
                    </h2>

                    <p className="relative mt-4 text-[14px] leading-relaxed text-mist">{v.summary}</p>

                    <ul className="relative mt-6 space-y-2 text-[13px] text-ink/80">
                      {v.points.map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span
                            className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: v.color, boxShadow: `0 0 8px ${v.color}` }}
                          />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      aria-hidden
                      className="relative mt-auto pt-8 text-[10px] uppercase tracking-[0.24em]"
                      style={{ color: v.color }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-1 w-1 rounded-full"
                          style={{ background: v.color, boxShadow: `0 0 6px ${v.color}` }}
                        />
                        Active vertical
                      </span>
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </PageShell>
  );
}
