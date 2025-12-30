import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PayOnUsToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expirationTime?: number;
}

interface PayOnUsStore {
  token: PayOnUsToken | null;
  isTokenValid: boolean;

  // Actions
  setToken: (token: PayOnUsToken) => void;
  clearToken: () => void;
  getToken: () => PayOnUsToken | null;
  isTokenExpired: () => boolean;
}

const COOKIE_NAME = 'pay-on-us-access-token';

export const usePayOnUsStore = create<PayOnUsStore>()(
  persist(
    (set, get) => ({
      token: null,
      isTokenValid: false,

      setToken: (token: PayOnUsToken) => {
        // console.log("Setting pay-on-us token:", token);
        // Calculate expiration time (current time + expires_in seconds)
        const expirationTime = Date.now() + (token.expires_in * 1000);

        // Store token with expiration time
        const tokenWithExpiration = {
          ...token,
          expirationTime
        };

        // console.log("Token with expiration:", tokenWithExpiration);

        // Save to cookie
        setCookie(COOKIE_NAME, JSON.stringify(tokenWithExpiration), {
          maxAge: token.expires_in, // expires_in is in seconds
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });

        set({
          token: tokenWithExpiration,
          isTokenValid: true
        });
      },

      clearToken: () => {
        deleteCookie(COOKIE_NAME);
        set({
          token: null,
          isTokenValid: false
        });
      },

      getToken: () => {
        const state = get();
        if (state.token && !state.isTokenExpired()) {
          return state.token;
        }
        return null;
      },

      isTokenExpired: () => {
        const state = get();
        if (!state.token || !state.token.expirationTime) {
          return true;
        }
        return Date.now() >= state.token.expirationTime;
      }
    }),
    {
      name: 'pay-on-us-store',
      // Only persist the token, not the computed values
      partialize: (state) => ({ token: state.token }),
      // Initialize from cookie on store creation
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined') {
          const cookieToken = getCookie(COOKIE_NAME);
          if (cookieToken) {
            try {
              const parsedToken = JSON.parse(cookieToken as string);
              if (parsedToken && !state?.isTokenExpired()) {
                state?.setToken(parsedToken);
              } else {
                state?.clearToken();
              }
            } catch {
              // console.error('Error parsing pay-on-us token from cookie:', error);
              state?.clearToken();
            }
          }
        }
      }
    }
  )
);
