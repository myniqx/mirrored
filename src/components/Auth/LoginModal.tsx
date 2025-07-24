"use client"
import { useState } from "react"
import type React from "react"

import { Modal } from "@/components/ui/modal"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "./LoginForm"
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import { Avatar } from "@/components/ui/avatar"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { user } = useAuth()

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {user ? (
        <div className="flex items-center space-x-4">
          <Avatar src={user.photoURL} alt={user.name} />
          <p>Welcome back, {user.name}!</p>
        </div>
      ) : showForgotPassword ? (
        <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
      ) : (
        <LoginForm onForgotPassword={handleForgotPassword} />
      )}
    </Modal>
  )
}

