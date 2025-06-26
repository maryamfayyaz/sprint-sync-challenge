"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { logger } from "@/lib/logger"
import { API_BASE_URL } from '@/lib/api-client'

interface User {
  id: number
  email: string
  isAdmin: boolean
  name?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session on app load
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      setToken(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      logger.info("Attempting login", { email })
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()
      const { token: newToken, user: userData } = data

      localStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(userData)

      logger.info("Login successful", { userId: userData?.id })
    } catch (error) {
      logger.error("Login failed", error)
      throw error
    }
  }

  const logout = () => {
    logger.info("User logged out")
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
