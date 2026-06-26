import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/terra/SmoothScroll";
import { EnergyCursor } from "@/components/terra/Cursor";
import { TopNav, SideTimeline } from "@/components/terra/Nav";
import { IntroLoader } from "@/components/terra/Loader";
import { Hero } from "@/components/terra/Hero";
import {
  Mission,
  Ecosystem,
  Research,
  Education,
  Finance,
  Impact,
  Global,
  Future,
} from "@/components/terra/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Terra Belle Foundation — A Regenerative Operating System" },
      {
        name: "description",
        content:
          "An immersive ecosystem uniting technology, renewable energy, environmental stewardship, AI, finance and education into one continuous regenerative loop.",
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
      <EnergyCursor />
      <TopNav />
      <SideTimeline />

      <main className="relative">
        <Hero />
        <Mission />
        <Ecosystem />
        <Research />
        <Education />
        <Finance />
        <Impact />
        <Global />
        <Future />
      </main>
    </>
  );
}
