import axios from "axios"
import type { User, Bookmark } from "@/types/User"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const login = async (email: string, password: string): Promise<User> => {
  const response = await api.post("/auth/login", { email, password })
  return response.data
}

export const register = async (name: string, email: string, password: string): Promise<User> => {
  const response = await api.post("/auth/register", { name, email, password })
  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout")
}

export const forgotPassword = async (email: string): Promise<void> => {
  await api.post("/auth/forgot-password", { email })
}

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get("/user/profile")
  return response.data
}

export const addBookmark = async (bookmark: Omit<Bookmark, "id">): Promise<Bookmark> => {
  const response = await api.post("/user/bookmarks", bookmark)
  return response.data
}

export const updateBookmark = async (bookmarkId: string, bookmark: Partial<Bookmark>): Promise<Bookmark> => {
  const response = await api.put(`/user/bookmarks/${bookmarkId}`, bookmark)
  return response.data
}

export const deleteBookmark = async (bookmarkId: string): Promise<void> => {
  await api.delete(`/user/bookmarks/${bookmarkId}`)
}

