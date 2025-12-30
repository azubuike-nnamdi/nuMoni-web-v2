import { clearAuthCookies, setAuthCookies } from '@/lib/cookies-utils';
import { AuthUser, AuthUserStore } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserAuthStore = create<AuthUserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logoutInProgress: false,

      setUser: (user: AuthUser) => {
        // Set cookies when user is set (including regLevel)
        setAuthCookies(user.usertype, user.id, user.token, user.refreshToken, user.regLevel);

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          logoutInProgress: false
        });
      },

      clearUser: () => {
        // Clear cookies when user is cleared
        clearAuthCookies();

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          logoutInProgress: false
        });
      },

      updateTokens: (token: string, refreshToken: string) => {
        const currentUser = get().user;
        if (currentUser) {
          // Update cookies with new tokens
          setAuthCookies(currentUser.usertype, currentUser.id, token, refreshToken);

          set({
            user: {
              ...currentUser,
              token,
              refreshToken,
            }
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setLogoutInProgress: (inProgress: boolean) => {
        set({ logoutInProgress: inProgress });
      },
    }),
    {
      name: 'numoni-user-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
