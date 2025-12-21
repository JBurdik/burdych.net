import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/Hero";
import { Experience } from "../components/Experience";
import { Projects } from "../components/Projects";
import { Technologies } from "../components/Technologies";
import { About } from "../components/About";
import { ScrollProgress } from "../components/ui/ScrollProgress";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
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

      {/* Footer */}
      <footer className="relative py-8 bg-[#0a0a0f] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Portfolio. Built with{" "}
            <span className="text-cyan-400">React</span>,{" "}
            <span className="text-purple-400">TanStack</span>, and{" "}
            <span className="text-pink-400">Framer Motion</span>.
          </p>
        </div>
      </footer>
    </main>
  );
}
