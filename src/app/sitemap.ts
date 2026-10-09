import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { legalNav, POLICY_VERSION } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const policyDate = new Date(POLICY_VERSION);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/legal`,
      lastModified: policyDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...legalNav.map((entry) => ({
      url: `${SITE_URL}/legal/${entry.slug}`,
      lastModified: policyDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
