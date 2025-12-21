import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

// Export commonly used hooks/methods
export const { signIn, signUp, signOut, useSession } = authClient;
