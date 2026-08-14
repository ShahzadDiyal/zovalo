import type { MetadataRoute } from "next";

const SITE_URL = "https://royalfurnitures.store";

// Bots/agents used by AI answer engines & shopping agents. Listed explicitly
// (even though "*" already allows everything) so it's obvious at a glance
// that Royal Furniture wants to be discoverable and citable by AI tools like
// ChatGPT, Claude, Perplexity, and Google's AI features.
const AI_AGENT_USER_AGENTS = [
  "GPTBot", // OpenAI
  "ChatGPT-User", // OpenAI (agentic browsing)
  "OAI-SearchBot", // OpenAI search
  "ClaudeBot", // Anthropic
  "Claude-User", // Anthropic (agentic browsing)
  "anthropic-ai", // Anthropic
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Google AI training/grounding
  "Applebot-Extended", // Apple Intelligence
  "Bytespider", // TikTok/ByteDance AI
  "CCBot", // Common Crawl (feeds many LLMs)
  "Meta-ExternalAgent", // Meta AI
];

const disallow = [
  "/admin",
  "/admin/",
  "/cart",
  "/checkout",
  "/auth",
  "/register",
  "/profile",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      ...AI_AGENT_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
