import {
  LeafIcon,
  SunIcon,
  WaterIcon,
  WindIcon,
  NetworkIcon,
  ChartIcon,
} from "@/components/terra/Icons";

export type VerticalCategory =
  | "Nature"
  | "Energy"
  | "Atmosphere"
  | "Aerospace"
  | "Materials"
  | "Community";

export type Vertical = {
  slug: string;
  title: string;
  short: string;
  eyebrow: string;
  category: VerticalCategory;
  color: string;
  Icon: typeof LeafIcon;
  summary: string;
  points: string[];
  hero: string;
  metrics: { value: string; label: string }[];
  phases: { name: string; detail: string }[];
  partners: string[];
  bridges: { slug: string; label: string }[];
};

export const CATEGORIES: (VerticalCategory | "All")[] = [
  "All",
  "Nature",
  "Energy",
  "Atmosphere",
  "Aerospace",
  "Materials",
  "Community",
];

export const VERTICALS: Vertical[] = [
  {
    slug: "web3-mrv",
    title: "Web3 Carbon Credit MRV & Reforestation",
    short: "MRV & Reforestation",
    eyebrow: "Verified Regeneration",
    category: "Nature",
    color: "#0DBB63",
    Icon: LeafIcon,
    summary:
      "On-chain Measurement, Reporting and Verification for high-integrity carbon credits — pairing satellite + LiDAR biomass models with smart-contract issuance so every tonne of CO₂ removed is traceable, audit-grade, and double-counting proof.",
    hero: "A forest that keeps its own ledger. Every tree measured, every tonne witnessed, every credit accountable to the biome that produced it.",
    points: [
      "Tokenised carbon credits backed by parcel-level reforestation",
      "Open MRV pipeline auditable by partners and the public",
      "Community-owned reforestation sites with revenue share",
    ],
    metrics: [
      { value: "1.4M", label: "Trees under active MRV" },
      { value: "312k", label: "Verified tCO₂e issued" },
      { value: "48", label: "Community stewards" },
    ],
    phases: [
      { name: "Sense", detail: "Satellite, LiDAR and ground truthing establish parcel-level biomass baselines." },
      { name: "Model", detail: "Growth curves, mortality risk and permanence buffers computed continuously." },
      { name: "Attest", detail: "Third-party validators sign attestations that anchor on-chain." },
      { name: "Issue", detail: "Smart contracts mint credits proportional to verified sequestration." },
      { name: "Retire", detail: "Public retirement registry closes the loop and prevents double counting." },
    ],
    partners: ["Independent validators", "Local cooperatives", "Open MRV working group"],
    bridges: [
      { slug: "dac", label: "Feeds the same registry as Direct Air Capture" },
      { slug: "wildtracks", label: "Overlaps conservation corridors with WildTracks" },
    ],
  },
  {
    slug: "hydro-aviation",
    title: "Hydroelectric-Powered Airplane Engines",
    short: "Aviation R&D",
    eyebrow: "Aerospace R&D",
    category: "Aerospace",
    color: "#6B8CF7",
    Icon: WindIcon,
    summary:
      "Long-horizon research into liquid-hydrogen turbines and hydro-electrically produced green H₂ fuel chains — designing the pathway to zero-emission flight by powering electrolysis from renewable hydroelectric grids.",
    hero: "Rivers becoming runways. A fuel chain where mountain water becomes hydrogen, and hydrogen becomes flight without a trace.",
    points: [
      "Green-hydrogen turbine prototypes for regional aviation",
      "Hydroelectric → electrolysis → cryogenic fuel supply chain",
      "Co-development with university aerospace labs",
    ],
    metrics: [
      { value: "3", label: "Turbine prototypes in test" },
      { value: "92%", label: "Cycle efficiency target" },
      { value: "0", label: "Combustion CO₂ per km" },
    ],
    phases: [
      { name: "Source", detail: "Curtailed hydroelectric power routed to on-site electrolysers." },
      { name: "Produce", detail: "Green hydrogen liquefied and stored cryogenically at the airfield." },
      { name: "Combust", detail: "Custom turbine burns H₂ with water vapor as the only exhaust." },
      { name: "Iterate", detail: "Flight-envelope data feeds the next generation of blade geometry." },
    ],
    partners: ["University aerospace labs", "Hydro grid operators", "Aviation certification bodies"],
    bridges: [
      { slug: "green-energy", label: "Draws surplus from Distributed Green Energy" },
      { slug: "dac", label: "Legacy emissions offset by Direct Air Capture" },
    ],
  },
  {
    slug: "green-energy",
    title: "Distributed Green Energy",
    short: "Distributed Green Energy",
    eyebrow: "Renewable Infrastructure",
    category: "Energy",
    color: "#F4B000",
    Icon: SunIcon,
    summary:
      "Community-scale solar, micro-hydro and storage networks deployed where they multiply impact — electrifying rural economies while feeding surplus generation back into national grids.",
    hero: "A grid that behaves like a mycelium — many small sources, always sharing, always adapting to where the light is needed most.",
    points: [
      "Microgrid deployments with local cooperative ownership",
      "Battery and pumped-storage to firm intermittent supply",
      "Carbon-aware load scheduling powered by the AI layer",
    ],
    metrics: [
      { value: "27 MW", label: "Distributed capacity live" },
      { value: "14k", label: "Households electrified" },
      { value: "62%", label: "Curtailed power recovered" },
    ],
    phases: [
      { name: "Map", detail: "Community demand and renewable potential surveyed together." },
      { name: "Build", detail: "Modular solar arrays, micro-hydro and storage co-installed with locals." },
      { name: "Balance", detail: "AI load scheduler shifts consumption to greenest hours." },
      { name: "Share", detail: "Surplus wheeled to neighbouring grids or upstream verticals." },
    ],
    partners: ["Rural cooperatives", "National grid operators", "Battery hardware partners"],
    bridges: [
      { slug: "hydro-aviation", label: "Powers electrolysis for aviation fuel" },
      { slug: "dac", label: "Runs Direct Air Capture on curtailed hours" },
    ],
  },
  {
    slug: "dac",
    title: "Direct Air Carbon Removal",
    short: "Direct Air Removal",
    eyebrow: "Atmospheric Repair",
    category: "Atmosphere",
    color: "#0E46B8",
    Icon: NetworkIcon,
    summary:
      "Modular direct-air-capture units paired with mineralisation and bio-sequestration to remove legacy CO₂ from the atmosphere — engineered to be powered exclusively by surplus renewable energy.",
    hero: "The atmosphere gets its lungs back. Machines that breathe in the last century's emissions and turn them into stone.",
    points: [
      "Sorbent-based DAC with mineralised, permanent storage",
      "Co-located with renewables to use otherwise-curtailed power",
      "Removed tonnes feed the same MRV registry as forestry",
    ],
    metrics: [
      { value: "1,200 t", label: "CO₂ removed to date" },
      { value: "10 kt", label: "Annual capacity by phase III" },
      { value: "10 kyr", label: "Storage permanence" },
    ],
    phases: [
      { name: "Capture", detail: "Solid sorbent contactors pull CO₂ from ambient air." },
      { name: "Concentrate", detail: "Low-grade renewable heat regenerates the sorbent." },
      { name: "Mineralise", detail: "CO₂ reacts with basalt to form permanent carbonate rock." },
      { name: "Register", detail: "Every tonne issued through the same on-chain MRV pipeline." },
    ],
    partners: ["Basalt geologists", "Renewable operators", "MRV validators"],
    bridges: [
      { slug: "web3-mrv", label: "Shares the MRV & credit registry" },
      { slug: "green-energy", label: "Absorbs surplus from Distributed Green Energy" },
    ],
  },
  {
    slug: "carbon-mortar",
    title: "Green Construction & Carbon Mortar",
    short: "Green Construction",
    eyebrow: "Built Environment",
    category: "Materials",
    color: "#0DBB63",
    Icon: ChartIcon,
    summary:
      "Low-clinker cement, carbon-cured mortars and bio-aggregate composites that sequester CO₂ inside the buildings we already need — turning the construction sector from the world's largest emitter into a carbon sink.",
    hero: "Cities that store carbon in their walls. Every beam a reservoir, every façade a leaf.",
    points: [
      "Carbon-mineralising mortar and CO₂-cured precast",
      "Hempcrete, mycelium and bio-composite structural panels",
      "Embodied-carbon labelling integrated with the MRV stack",
    ],
    metrics: [
      { value: "-38%", label: "Embodied carbon vs. baseline" },
      { value: "18 kg", label: "CO₂ stored per m³ mortar" },
      { value: "6", label: "Pilot buildings underway" },
    ],
    phases: [
      { name: "Formulate", detail: "Low-clinker blends and bio-aggregates tuned to local supply chains." },
      { name: "Cure", detail: "CO₂ from DAC and industry injected into precast during curing." },
      { name: "Certify", detail: "Embodied carbon labelled and audited on the MRV registry." },
      { name: "Scale", detail: "Open specifications shared with regional builders." },
    ],
    partners: ["Structural engineers", "Cement innovators", "Certification bodies"],
    bridges: [
      { slug: "dac", label: "Uses DAC CO₂ as a building input" },
      { slug: "vertical-gardens", label: "Substrate for living façade systems" },
    ],
  },
  {
    slug: "vertical-gardens",
    title: "Vertical Gardens & Urban Forestry",
    short: "Vertical Gardens",
    eyebrow: "Living Architecture",
    category: "Nature",
    color: "#0DBB63",
    Icon: LeafIcon,
    summary:
      "Façade-integrated vertical gardens, rooftop food forests and modular living walls that cool cities, clean air, restore pollinators and shorten food supply chains — biology returned to the centre of urban design.",
    hero: "Buildings that breathe. Streets that shade themselves. Pollinators that find a corridor where there used to be concrete.",
    points: [
      "Modular hydroponic and soil-substrate wall systems",
      "Native-species planting plans designed for local pollinators",
      "Cooling, air-quality and biodiversity gains measured live",
    ],
    metrics: [
      { value: "-4.2°C", label: "Local façade cooling" },
      { value: "128", label: "Native species planted" },
      { value: "22", label: "Buildings greened" },
    ],
    phases: [
      { name: "Design", detail: "Species and substrate matched to microclimate and building physics." },
      { name: "Install", detail: "Modular panels assembled with local labour and materials." },
      { name: "Sense", detail: "Air quality, cooling and biodiversity metrics streamed continuously." },
      { name: "Multiply", detail: "Neighbourhood corridors linked for pollinator continuity." },
    ],
    partners: ["Urban ecologists", "City housing authorities", "Native-plant nurseries"],
    bridges: [
      { slug: "carbon-mortar", label: "Mounted on carbon-storing substrates" },
      { slug: "web3-mrv", label: "Biodiversity data feeds the MRV registry" },
    ],
  },
  {
    slug: "wildtracks",
    title: "Conservation Tourism · WildTracks",
    short: "WildTracks Tourism",
    eyebrow: "Partnership",
    category: "Community",
    color: "#6B8CF7",
    Icon: WaterIcon,
    summary:
      "In partnership with WildTracks, regenerative conservation-tourism experiences that channel visitor revenue directly into rewilding, primate and manatee rehabilitation, and protected-area stewardship in Belize and beyond.",
    hero: "Travel as stewardship. Every visitor becomes a funder of the rehabilitation happening quietly in the mangroves.",
    points: [
      "Low-impact lodges co-managed with conservation partners",
      "Visitor fees fund rehabilitation of rescued wildlife",
      "Researcher and volunteer placements alongside guests",
    ],
    metrics: [
      { value: "94", label: "Rescued primates rehabilitated" },
      { value: "31", label: "Manatees returned to wild" },
      { value: "100%", label: "Visitor fees to conservation" },
    ],
    phases: [
      { name: "Host", detail: "Small-group stays inside co-managed conservation reserves." },
      { name: "Fund", detail: "Every visitor fee flows directly into rehabilitation budgets." },
      { name: "Rehabilitate", detail: "Veterinary teams prepare rescued animals for release." },
      { name: "Return", detail: "Wildlife released back into monitored, protected corridors." },
    ],
    partners: ["WildTracks Belize", "Regional wildlife authorities", "Field researchers"],
    bridges: [
      { slug: "web3-mrv", label: "Corridors overlap MRV reforestation parcels" },
      { slug: "vertical-gardens", label: "Habitat continuity extends into urban corridors" },
    ],
  },
];

export const getVertical = (slug: string) => VERTICALS.find((v) => v.slug === slug);
