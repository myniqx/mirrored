'use client'

import type React from 'react'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface LoginFormProps {
  onForgotPassword: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loginWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.loading('Logging in...', {
      description: 'Please wait while we log you in.',
    })
    try {
      await login(email, password)
      toast.success('Login successful!', {
        description: 'You have successfully logged in.',
      })
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed', {
        description: 'Please check your credentials.',
      })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      toast.success('Google login successful!', {
        description: 'You have successfully logged in with Google.',
      })
    } catch (error) {
      console.error('Google login failed:', error)
      toast.error('Google login failed', { description: 'Please try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full"
      >
        Login with Google
      </Button>
      <Button
        type="button"
        variant="link"
        onClick={onForgotPassword}
        className="w-full"
      >
        Forgot Password?
      </Button>
    </form>
  )
}
