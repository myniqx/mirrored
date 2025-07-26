import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@vercel/postgres'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  const client = createClient()
  await client.connect()

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])

    if (result.rows.length > 0) {
      // In a real application, you would generate a password reset token and send an email here
      res
        .status(200)
        .json({ message: 'Password reset instructions sent to your email' })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Internal server error' })
  } finally {
    await client.end()
  }
}
