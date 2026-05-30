/**
 * Lightweight per-service display metadata (title + accent color), shared by
 * the service detail page and the checkout page so they stay visually in sync.
 */
export type ServiceMeta = {
  title: string;
  accentColor: string;
  accentBg: string;
};

export const SERVICE_META: Record<string, ServiceMeta> = {
  "individual-therapy": {
    title: "Individual Therapy",
    accentColor: "#6EA593",
    accentBg: "rgba(110,165,147,0.1)",
  },
  "couples-therapy": {
    title: "Couples Therapy",
    accentColor: "#8E7AB8",
    accentBg: "rgba(142,122,184,0.1)",
  },
  "child-adolescent-therapy": {
    title: "Child & Adolescent Therapy",
    accentColor: "#D4929A",
    accentBg: "rgba(212,146,154,0.1)",
  },
  "career-counselling": {
    title: "Career Counselling",
    accentColor: "#D4A040",
    accentBg: "rgba(212,160,64,0.1)",
  },
};
