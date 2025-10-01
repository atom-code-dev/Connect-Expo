import { betterAuth } from "better-auth/client"
import Constants from 'expo-constants'

// Get the base URL from environment or use localhost for development
const getBaseURL = () => {
  if (__DEV__) {
    // For development, use the Next.js server URL
    return 'http://localhost:3000'
  }
  // For production, this should be your deployed Next.js URL
  return Constants.expoConfig?.extra?.baseURL || 'http://localhost:3000'
}

export const authClient = betterAuth({
  baseURL: getBaseURL(),
  plugins: []
})

export type Session = typeof authClient.$Infer.Session