"use client"

import { useState, useEffect } from "react"
import type { User, Bookmark } from "@/types/User"
import * as api from "@/services/api"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await api.getUserProfile()
        setUser(userData)
      } catch (error) {
        console.error("Failed to load user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userData = await api.login(email, password)
      setUser(userData)
      return userData
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const userData = await api.register(name, email, password)
      setUser(userData)
      return userData
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await api.forgotPassword(email)
    } catch (error) {
      console.error("Forgot password request failed:", error)
      throw error
    }
  }

  const addBookmark = async (name: string, page: number) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const newBookmark = await api.addBookmark({
        name,
        createdAt: new Date(),
        lastReadAt: new Date(),
        page,
      })
      setUser({ ...user, bookmarks: [...user.bookmarks, newBookmark] })
      return newBookmark
    } catch (error) {
      console.error("Failed to add bookmark:", error)
      throw error
    }
  }

  const updateBookmark = async (bookmarkId: string, updates: Partial<Omit<Bookmark, "id">>) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const updatedBookmark = await api.updateBookmark(bookmarkId, updates)
      setUser({
        ...user,
        bookmarks: user.bookmarks.map((b) => (b.id === bookmarkId ? updatedBookmark : b)),
      })
      return updatedBookmark
    } catch (error) {
      console.error("Failed to update bookmark:", error)
      throw error
    }
  }

  const deleteBookmark = async (bookmarkId: string) => {
    if (!user) throw new Error("User not authenticated")

    try {
      await api.deleteBookmark(bookmarkId)
      setUser({
        ...user,
        bookmarks: user.bookmarks.filter((b) => b.id !== bookmarkId),
      })
    } catch (error) {
      console.error("Failed to delete bookmark:", error)
      throw error
    }
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  }
}

