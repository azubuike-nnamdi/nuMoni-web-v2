import { deleteCookie, getCookie, setCookie } from 'cookies-next'

// Cookie names
export const COOKIE_NAMES = {
  USER_TYPE: 'user-type',
  USER_ID: 'user-id',
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
  REG_LEVEL: 'reg-level',
  AUTH_STORAGE: 'auth-user-storage'
} as const

// Set auth cookies
export const setAuthCookies = (userType: string, userId: string, accessToken: string, refreshToken: string, regLevel?: number) => {
  setCookie(COOKIE_NAMES.USER_TYPE, userType, {
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    // secure: true,
    // sameSite: 'strict'
  })

  setCookie(COOKIE_NAMES.USER_ID, userId, {
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    // secure: true,
    // sameSite: 'strict'
  })

  setCookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    // secure: true,
    // sameSite: 'strict'
  })

  setCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    maxAge: 60 * 60 * 24 * 7, // 7 days for refresh token
    path: '/',
    // secure: true,
    // sameSite: 'strict'
  })

  if (regLevel !== undefined) {
    setCookie(COOKIE_NAMES.REG_LEVEL, String(regLevel), {
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      // secure: true,
      // sameSite: 'strict'
    })
  }
}

// Get auth cookies
export const getAuthCookies = () => {
  const regLevelCookie = getCookie(COOKIE_NAMES.REG_LEVEL);
  return {
    userType: getCookie(COOKIE_NAMES.USER_TYPE),
    userId: getCookie(COOKIE_NAMES.USER_ID),
    accessToken: getCookie(COOKIE_NAMES.ACCESS_TOKEN),
    refreshToken: getCookie(COOKIE_NAMES.REFRESH_TOKEN),
    regLevel: regLevelCookie ? Number(regLevelCookie) : undefined
  }
}

// Clear auth cookies
export const clearAuthCookies = () => {
  deleteCookie(COOKIE_NAMES.USER_TYPE)
  deleteCookie(COOKIE_NAMES.USER_ID)
  deleteCookie(COOKIE_NAMES.ACCESS_TOKEN)
  deleteCookie(COOKIE_NAMES.REFRESH_TOKEN)
  deleteCookie(COOKIE_NAMES.REG_LEVEL)
}

// Check if user is authenticated via cookies
export const isAuthenticatedViaCookies = () => {
  const { userType, userId, accessToken } = getAuthCookies()
  return !!(userType && userId && accessToken)
}
