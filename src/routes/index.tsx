import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/terra/SmoothScroll";
import { EnergyCursor } from "@/components/terra/Cursor";
import { ParticleNetwork } from "@/components/terra/ParticleNetwork";
import { TopNav, SideTimeline } from "@/components/terra/Nav";
import { IntroLoader } from "@/components/terra/Loader";
import { EnergyDivider } from "@/components/terra/Divider";
import { Hero } from "@/components/terra/Hero";
import { FlowProvider } from "@/components/terra/FlowContext";
import {
  PlanetChapter,
  EcosystemChapter,
  CircularChapter,
  ImpactChapter,
  CollaborationChapter,
  FutureChapter,
} from "@/components/terra/Chapters";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Terra Belle Foundation — A Regenerative Operating System" },
      {
        name: "description",
        content:
          "A cinematic journey through Terra Belle's living ecosystem — technology, energy, finance, research, education and community operating as one continuous regenerative loop.",
      },
      { property: "og:title", content: "Terra Belle Foundation" },
      {
        property: "og:description",
        content: "A regenerative operating system for the planet.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <IntroLoader />
      <SmoothScroll />
      <ParticleNetwork />
      <EnergyCursor />
      <FlowProvider>
        <TopNav />
        <SideTimeline />

        <main className="relative z-10">
          {/* 01 · Genesis */}
          <Hero />
          <EnergyDivider />

          {/* 02 · The Planet */}
          <PlanetChapter />
          <EnergyDivider flip />

          {/* 03 · The Ecosystem */}
          <EcosystemChapter />
          <EnergyDivider />

          {/* 04 · The Circular Economy */}
          <CircularChapter />
          <EnergyDivider flip />

          {/* 05 · The Impact Engine */}
          <ImpactChapter />
          <EnergyDivider />

          {/* 06 · The Collaboration Network */}
          <CollaborationChapter />
          <EnergyDivider flip />

          {/* 07 · The Future (loops back to Genesis) */}
          <FutureChapter />
        </main>
      </FlowProvider>
    </>
  );
}
