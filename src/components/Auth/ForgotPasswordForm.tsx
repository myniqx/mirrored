"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"


interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("")
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await resetPassword(email)
      toast.success("Password reset email sent!", { description: "Check your inbox for further instructions." })
    } catch (error) {
      console.error("Password reset failed:", error)
      toast.error("Password reset failed", { description: "Please try again." })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        Send Reset Email
      </Button>
      <Button type="button" variant="link" onClick={onBackToLogin} className="w-full">
        Back to Login
      </Button>
    </form>
  )
}

