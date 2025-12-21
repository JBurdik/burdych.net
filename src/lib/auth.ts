import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  // Prepared for future subdomain sharing
  advanced: {
    crossSubDomainCookies: {
      enabled: false, // Enable when deploying to production with subdomains
      // domain: ".burdych.net",
    },
  },
  // trustedOrigins: [], // Add when deploying
});
