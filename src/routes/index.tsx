import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/Hero";
import { Experience } from "../components/Experience";
import { Projects } from "../components/Projects";
import { Technologies } from "../components/Technologies";
import { About } from "../components/About";
import { Footer } from "../components/Footer";
import { ScrollProgress } from "../components/ui/ScrollProgress";
import { SmoothScroll } from "../components/SmoothScroll";
import { getProjects } from "../server/projects";
import { getExperiences } from "../server/experiences";
import { getTechnologies } from "../server/technologies";
import { getAbout } from "../server/about";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const [projects, experiences, technologies, about] = await Promise.all([
      getProjects(),
      getExperiences(),
      getTechnologies(),
      getAbout(),
    ]);
    return { projects, experiences, technologies, about };
  },
});

function App() {
  const { projects, experiences, technologies, about } = Route.useLoaderData();

  return (
    <SmoothScroll>
      <main className="relative">
        {/* Scroll progress indicator */}
        <ScrollProgress />

        {/* Noise overlay for texture */}
        <div className="noise-overlay" />

        {/* Sections */}
        <Hero />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Technologies technologies={technologies} />
        {about && <About about={about} />}
        <Footer />
      </main>
    </SmoothScroll>
  );
}
