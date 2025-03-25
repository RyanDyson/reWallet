import { createClient } from "jstack";
import type { AppRouter } from "@/server";

export const client = createClient<AppRouter>({
  baseUrl: `${getBaseUrl()}/api`,
});

function getBaseUrl() {
  // 👇 Adjust for wherever you deploy
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:3000`;
}
