export interface IGoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export const googleAuthConfig = (): IGoogleOAuthConfig => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackUrl: process.env.GOOGLE_CALLBACK_URL,
});
