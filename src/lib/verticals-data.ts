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

export type VerticalProject = {
  id: string;
  name: string;
  location?: string;
  status: "Live" | "Piloting" | "R&D" | "Scaling";
  detail: string;
};

export type Vertical = {
  slug: string;
  title: string;
  short: string;
  eyebrow: string;
  category: VerticalCategory;
  color: string;
  Icon: typeof LeafIcon;
  summary: string;
  points?: string[];
  hero: string;
  mission: string;
  vision: string;
  goals: string[];
  drives: string[];
  projects: VerticalProject[];
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
    mission:
      "Rebuild trust in carbon markets by making every removal transparent, verifiable, and inseparable from the community that grew it.",
    vision:
      "A global registry where forests, wetlands and soils speak for themselves — and where regeneration is the most valuable asset on earth.",
    goals: [
      "Bring 10 million trees under continuous on-chain MRV by 2030",
      "Retire 1M tCO₂e of high-integrity credits with zero double-counting",
      "Route 50% of credit revenue back to local stewards",
    ],
    drives: [
      "Ending greenwashing with radical transparency",
      "Empowering community land stewards as first-class market actors",
      "Making biodiversity a measurable, financeable outcome",
    ],
    projects: [
      { id: "mrv-belize", name: "Mangrove MRV — Belize", location: "Belize", status: "Live", detail: "Satellite + drone biomass verification across coastal mangrove restoration parcels." },
      { id: "mrv-atlantic", name: "Atlantic Forest Ledger", location: "Brazil", status: "Piloting", detail: "Parcel-level tokenised credits with cooperative revenue share." },
      { id: "mrv-registry", name: "Open Retirement Registry", status: "Scaling", detail: "Public ledger closing the loop between issuance and retirement." },
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
    mission:
      "Prove that regional aviation can run on green hydrogen produced from surplus hydroelectric power — end to end, exhaust to source.",
    vision:
      "A commercial fleet whose only emission is water vapour, fuelled by rivers that would otherwise curtail.",
    goals: [
      "Certify a regional-class H₂ turbine airframe by the early 2030s",
      "Close a fully renewable H₂ fuel chain at two pilot airfields",
      "Publish open blade and combustor geometry for university replication",
    ],
    drives: [
      "Decarbonising the hardest-to-abate transport sector",
      "Turning curtailed hydro into a strategic energy carrier",
      "Building sovereign green-fuel capability outside fossil supply chains",
    ],
    projects: [
      { id: "h2-turbine-mk3", name: "H₂ Turbine — Mk III", status: "R&D", detail: "Third-generation combustor achieving 92% cycle efficiency in ground test." },
      { id: "hydro-electrolyser", name: "Andean Electrolyser Node", location: "Chile", status: "Piloting", detail: "5 MW electrolyser on curtailed hydro producing cryogenic H₂." },
      { id: "cryo-airfield", name: "Cryogenic Airfield Handling", status: "R&D", detail: "Ground handling and safety systems for liquid-H₂ refuelling." },
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
    mission:
      "Put clean, dispatchable power in the hands of the communities who need it most — and let their surplus lift everyone else.",
    vision:
      "A planet-scale mesh of cooperative microgrids where the last kilowatt is as green as the first.",
    goals: [
      "Deploy 250 MW of community-owned generation by 2032",
      "Electrify 100k off-grid households",
      "Recover 80% of otherwise-curtailed renewable output",
    ],
    drives: [
      "Energy sovereignty for rural and frontier communities",
      "Firming intermittent renewables with local storage",
      "Turning curtailment from waste into feedstock for other verticals",
    ],
    projects: [
      { id: "microgrid-belize", name: "Toledo Microgrid Cluster", location: "Belize", status: "Live", detail: "Solar + storage cooperative serving eight villages." },
      { id: "hydro-firming", name: "Micro-Hydro Firming Network", status: "Scaling", detail: "Run-of-river units firming solar output with pumped storage." },
      { id: "load-scheduler", name: "Carbon-Aware Load Scheduler", status: "Piloting", detail: "AI shifts community demand to the greenest hours of the day." },
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
    mission:
      "Remove legacy CO₂ from the air at gigatonne relevance — powered exclusively by renewable surplus and stored for geologic time.",
    vision:
      "A planet whose atmospheric carbon curve finally bends back down, one mineralised tonne at a time.",
    goals: [
      "Reach 100 kt/yr removal capacity across modular sites by 2030",
      "Achieve <$150/t removed at scale using curtailed renewables",
      "Certify every tonne through the same open MRV registry as forestry",
    ],
    drives: [
      "Repairing atmospheric damage that cannot wait for emission cuts alone",
      "Making removal accountable through the same registry as nature-based credits",
      "Coupling atmospheric repair to renewable surplus",
    ],
    projects: [
      { id: "dac-mod-01", name: "DAC Module 01 — Iceland", location: "Iceland", status: "Live", detail: "Sorbent contactor with basalt mineralisation, running on geothermal." },
      { id: "dac-basalt-scan", name: "Basalt Storage Atlas", status: "R&D", detail: "Global survey of reactive basalt reservoirs for permanent CO₂ storage." },
      { id: "dac-registry", name: "Removal Registry Integration", status: "Scaling", detail: "Every removed tonne issued through the shared MRV pipeline." },
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
    mission:
      "Turn the built environment from the planet's largest emitter into one of its most reliable carbon sinks.",
    vision:
      "Every new building specified with a negative embodied-carbon budget by default.",
    goals: [
      "Ship carbon-mineralising mortar and precast to 100 projects by 2030",
      "Cut embodied carbon 50% versus conventional concrete baselines",
      "Publish open specifications adopted by regional building codes",
    ],
    drives: [
      "Redirecting the largest material flow on earth toward sequestration",
      "Coupling construction demand to DAC and industrial CO₂ streams",
      "Restoring bio-based materials as first-class structural options",
    ],
    projects: [
      { id: "mortar-precast", name: "CO₂-Cured Precast Line", status: "Scaling", detail: "Precast facility injecting DAC-derived CO₂ during curing." },
      { id: "hempcrete", name: "Hempcrete Housing Pilot", location: "Portugal", status: "Piloting", detail: "Six-home development with bio-composite structural panels." },
      { id: "embodied-label", name: "Embodied Carbon Label", status: "R&D", detail: "Building-scale carbon label wired to the shared MRV registry." },
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
    mission:
      "Return biology to the centre of urban design — cooling cities, cleaning air and restoring pollinators one façade at a time.",
    vision:
      "Cities where every building contributes measurable biodiversity, cooling and food to its neighbourhood.",
    goals: [
      "Green 500 building façades across five cities by 2032",
      "Establish continuous pollinator corridors in each pilot neighbourhood",
      "Cut local surface temperatures by 3–5°C at greened sites",
    ],
    drives: [
      "Reversing the urban heat-island effect",
      "Reconnecting fragmented pollinator habitat",
      "Shortening urban food supply chains at street scale",
    ],
    projects: [
      { id: "facade-lisbon", name: "Lisbon Façade Pilot", location: "Portugal", status: "Live", detail: "Modular hydroponic walls across a public-housing block." },
      { id: "pollinator-corridor", name: "Pollinator Corridor 01", status: "Piloting", detail: "Neighbourhood-scale native planting network connecting six greened buildings." },
      { id: "rooftop-forest", name: "Rooftop Food Forest", status: "Scaling", detail: "Edible perennials on institutional rooftops feeding local kitchens." },
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
    mission:
      "Make every visitor a direct funder of wildlife rehabilitation and protected-area stewardship — with zero extraction and full transparency.",
    vision:
      "A model of conservation tourism replicated across biomes, where travel actively rebuilds the ecosystems it visits.",
    goals: [
      "Fully fund WildTracks primate & manatee rehabilitation year-round",
      "Open two new low-impact lodges inside co-managed reserves",
      "Route 100% of visitor fees into conservation and community budgets",
    ],
    drives: [
      "Turning tourism from extractive to regenerative",
      "Giving rescued wildlife a real path back to the wild",
      "Funding conservation in perpetuity through visitor participation",
    ],
    projects: [
      { id: "wt-primate", name: "Primate Rehabilitation Centre", location: "Sarteneja, Belize", status: "Live", detail: "Long-running rehabilitation and release programme for rescued primates." },
      { id: "wt-manatee", name: "Manatee Rescue & Release", location: "Northern Belize", status: "Live", detail: "Veterinary rescue, rehabilitation and monitored release of Antillean manatees." },
      { id: "wt-lodge", name: "Regenerative Lodge Programme", status: "Piloting", detail: "Low-impact lodges co-managed with local conservation partners." },
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
export const getVerticalIndex = (slug: string) => VERTICALS.findIndex((v) => v.slug === slug);
