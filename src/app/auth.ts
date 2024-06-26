import NextAuth from "next-auth"
import AzureAD from "next-auth/providers/azure-ad";
import Google from "next-auth/providers/google"

export const providers = [
  AzureAD({
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    tenantId: process.env.AZURE_AD_TENANT_ID as string,
    authorization: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    token: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`
  }),
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
]


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers
})