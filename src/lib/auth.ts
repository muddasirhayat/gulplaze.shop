import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders:
    googleId && googleSecret
      ? {
          google: {
            clientId: googleId,
            clientSecret: googleSecret,
          },
        }
      : undefined,
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      twoFactorEnabled: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
      loyaltyPoints: {
        type: "number",
        defaultValue: 0,
        input: false,
      },
      referralCode: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    twoFactor({
      issuer: "GulPlaze",
    }),
    nextCookies(),
  ],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getStaffSession() {
  const session = await getSession();
  if (!session?.user) return null;
  const role = (session.user as { role?: string }).role;
  if (!role || role === "customer") return null;
  return session;
}
