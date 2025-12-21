import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/Hero";
import { Experience } from "../components/Experience";
import { Projects } from "../components/Projects";
import { Technologies } from "../components/Technologies";
import { About } from "../components/About";
import { Footer } from "../components/Footer";
import { ScrollProgress } from "../components/ui/ScrollProgress";
import { SmoothScroll } from "../components/SmoothScroll";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <SmoothScroll>
      <main className="relative">
        {/* Scroll progress indicator */}
        <ScrollProgress />

        {/* Noise overlay for texture */}
        <div className="noise-overlay" />

        {/* Sections */}
        <Hero />
        <Experience />
        <Projects />
        <Technologies />
        <About />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
