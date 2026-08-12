import type { MetadataRoute } from "next";
import { getNewsPosts, getProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/investors",
  "/projects",
  "/research",
  "/ip-patents",
  "/publications",
  "/team",
  "/news",
  "/collaboration",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, newsPosts] = await Promise.all([getProjects(), getNewsPosts()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const newsEntries: MetadataRoute.Sitemap = newsPosts.map((n) => ({
    url: `${SITE_URL}/news/${n.slug}`,
    lastModified: n.date,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticEntries, ...projectEntries, ...newsEntries];
}
