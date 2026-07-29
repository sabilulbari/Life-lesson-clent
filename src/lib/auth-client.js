import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: "http://localhost:3000" || "https://lifelessonclient.vercel.app",
  plugins: [jwtClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
export { authClient };
