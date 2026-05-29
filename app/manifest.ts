import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Study RPG",
    short_name: "StudyRPG",
    description: "Mobile-first RPG study tracker with EXP, quests, achievements, and growth graphs.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0d1118",
    theme_color: "#34d399",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
