import NextAuth, { DefaultSession } from "next-auth";
import { NextAuthOptions } from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/db";
import { Adapter } from "next-auth/adapters";

export interface ISession extends DefaultSession {
  user?: {
    id?: string | null | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    AzureAD({
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      authorization:
        "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      token: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    session: async ({ session, token, user }) => {
      const ses: ISession = {
        user: {
          id: user.id,
          name: session.user?.name,
          email: user.email,
          image: session.user?.image,
        },
        expires: session.expires,
      };
      return ses;
    },
  },
} satisfies NextAuthOptions;

// export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
export const getAuthSession = async () => getServerSession(authOptions);
