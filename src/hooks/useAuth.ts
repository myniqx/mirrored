"use client"

import { useState, useEffect } from "react"
import type { User } from "@/types/User"
import { auth, db } from "@/lib/firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth"
import { ref, get, set, update } from "firebase/database"

export const useAuth = () => {
  // States to manage user and loading status
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen to changes in user authentication state
  useEffect(() => {
    // Set persistent session management for Firebase
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Error setting session persistence:", error)
      })

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)

      try {
        if (firebaseUser) {
          // If user is authenticated, get user data from Realtime Database
          const userRef = ref(db, `users/${firebaseUser.uid}`)
          const snapshot = await get(userRef)

          if (snapshot.exists()) {
            // User exists in the database
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              ...snapshot.val()
            } as User)
          } else {
            // User exists in Auth but not in the database, create a basic record
            const basicUserData = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || "",
              bookmarks: []
            }
            await set(userRef, basicUserData)
            setUser(basicUserData as User)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    // Clean up listener when component unmounts
    return () => unsubscribe()
  }, [])

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password)

      // Get user data from the database
      const userRef = ref(db, `users/${firebaseUser.uid}`)
      const snapshot = await get(userRef)

      if (!snapshot.exists()) {
        // User exists in Auth but not in the database, create record
        const basicUserData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
          bookmarks: []
        }
        await set(userRef, basicUserData)
        setUser(basicUserData as User)
        return basicUserData
      }

      // Set user data to state
      const userData = { id: firebaseUser.uid, ...snapshot.val() } as User
      setUser(userData)
      return userData
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register new user
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)

      // Create new user record in the database
      const userData = {
        id: firebaseUser.uid,
        name,
        email,
        photoURL: firebaseUser.photoURL || "",
        bookmarks: []
      }

      await set(ref(db, `users/${firebaseUser.uid}`), userData)
      setUser(userData as User)
      return userData
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // User logout
  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  // Get user custom data
  const getData = async (): Promise<object> => {
    // Ensure user is authenticated
    if (!user) throw new Error("User not authenticated")

    try {
      const userRef = ref(db, `users/${user.id}`)
      const snapshot = await get(userRef)

      if (!snapshot.exists()) {
        throw new Error("User record not found")
      }
      return snapshot.val()?.customData || {}
    } catch (error) {
      console.error("Error fetching data:", error)
      throw error
    }
  }

  // Set user custom data
  const setData = async (data: object) => {
  // Ensure user is authenticated
    if (!user) throw new Error("User not authenticated")

    try {
      // Check if user record exists
      const userRef = ref(db, `users/${user.id}`)
      const snapshot = await get(userRef)

      if (!snapshot.exists()) {
        // Create new user record if it doesn't exist
        await set(userRef, {
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          customData: data
        })
      } else {
        // Update existing record with new custom data
        await update(userRef, {
          customData: data
        })
      }
    } catch (error) {
      console.error("Error saving data:", error)
      throw error
    }
  }

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      // Check if user exists in the database
      const userRef = ref(db, `users/${firebaseUser.uid}`)
      const snapshot = await get(userRef)

      if (!snapshot.exists()) {
        // Create user record if it doesn't exist
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
          bookmarks: []
        }
        await set(userRef, userData)
        setUser(userData as User)
        return userData
      }

      // Set user data to state
      const userData = { id: firebaseUser.uid, ...snapshot.val() } as User
      setUser(userData)
      return userData
    } catch (error) {
      console.error("Google login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Password reset failed:", error)
      throw error
    }
  }

  // Return hook's exported values and functions
  return {
    user,         // Current user (if logged in)
    loading,      // Loading state
    login,        // Email/password login
    register,     // New user registration
    logout,       // Logout
    getData,      // Get custom user data
    setData,      // Set custom user data
    loginWithGoogle, // Google login
    resetPassword,   // Password reset
  }
}
