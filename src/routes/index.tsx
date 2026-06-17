import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "../components/os/Desktop";
import { getProjects } from "../server/projects";
import { getExperiences } from "../server/experiences";
import { getTechnologies } from "../server/technologies";
import { getAbout } from "../server/about";
import { getMiniApps } from "../server/mini-apps";
import { getAppLinks } from "../server/app-links";
import { getIconLayout } from "../server/desktop-icons";
import { getPresignedViewUrls } from "../server/upload";
import { fetchSession } from "../lib/auth-middleware";
import { MINIO_PUBLIC_URL } from "../lib/minio";

// Check if URL is from MinIO and needs presigning
function isMinioUrl(url: string): boolean {
  return url.startsWith(MINIO_PUBLIC_URL) || url.includes("minio.burdych.net");
}

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const [projects, experiences, technologies, about, miniApps, appLinks, iconLayout, session] = await Promise.all([
      getProjects(),
      getExperiences(),
      getTechnologies(),
      getAbout(),
      getMiniApps(),
      getAppLinks(),
      getIconLayout(),
      fetchSession(),
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
      miniApps,
      appLinks,
      iconLayout,
      isAdmin: !!session,
    };
  },
});

function App() {
  const { projects, experiences, technologies, about, miniApps, appLinks, iconLayout, isAdmin } =
    Route.useLoaderData();

  return (
    <>
      <div className="noise-overlay" />
      <Desktop
        projects={projects}
        experiences={experiences}
        technologies={technologies}
        about={about}
        miniApps={miniApps}
        appLinks={appLinks}
        iconLayout={iconLayout}
        isAdmin={isAdmin}
      />
    </>
  );
}
