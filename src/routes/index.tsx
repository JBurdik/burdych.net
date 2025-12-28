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
import { getPresignedViewUrls } from "../server/upload";
import { MINIO_PUBLIC_URL } from "../lib/minio";

// Check if URL is from MinIO and needs presigning
function isMinioUrl(url: string): boolean {
  return url.startsWith(MINIO_PUBLIC_URL) || url.includes("minio.burdych.net");
}

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const [projects, experiences, technologies, about] = await Promise.all([
      getProjects(),
      getExperiences(),
      getTechnologies(),
      getAbout(),
    ]);

    // Collect all MinIO image URLs that need presigning
    const minioUrls: string[] = [];
    for (const project of projects) {
      if (project.images) {
        for (const url of project.images) {
          if (isMinioUrl(url)) {
            minioUrls.push(url);
          }
        }
      }
    }

    // Get presigned URLs for all MinIO images
    let urlMap: Record<string, string> = {};
    if (minioUrls.length > 0) {
      const { urls } = await getPresignedViewUrls({ data: minioUrls });
      urlMap = Object.fromEntries(urls.map((u) => [u.original, u.presigned]));
    }

    // Replace MinIO URLs with presigned URLs in projects
    const projectsWithPresignedUrls = projects.map((project) => ({
      ...project,
      images: project.images?.map((url) => urlMap[url] || url) || [],
    }));

    return {
      projects: projectsWithPresignedUrls,
      experiences,
      technologies,
      about,
    };
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
