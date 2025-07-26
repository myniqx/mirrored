'use client'
import { useState } from 'react'
import type React from 'react'

import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from './LoginForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog } from '@/components/ui/dialog'

interface LoginModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { user } = useAuth()

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {user ? (
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.photoURL} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0) || 'G'}</AvatarFallback>
          </Avatar>
          <p>Welcome back, {user.name}!</p>
        </div>
      ) : showForgotPassword ? (
        <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
      ) : (
        <LoginForm onForgotPassword={handleForgotPassword} />
      )}
    </Dialog>
  )
}
