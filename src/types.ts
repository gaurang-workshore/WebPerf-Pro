export type AuthMethod = 'none' | 'token' | 'login' | 'interactive';

export interface AuthCredentials {
  username?: string;
  password?: string;
  token?: string;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
}

export interface AuthConfig {
  method: AuthMethod;
  credentials?: AuthCredentials;
}

// Add type definition for Memberstack window object
declare global {
  interface Window {
    memberstack?: {
      getToken: () => string | null;
    };
  }
}