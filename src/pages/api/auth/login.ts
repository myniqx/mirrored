import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@vercel/postgres"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  const client = createClient()
  await client.connect()

  try {
    const result = await client.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password], // Note: In a real application, you should hash passwords
    )

    if (result.rows.length > 0) {
      const user = result.rows[0]
      // In a real application, you would create a session or JWT here
      res.status(200).json({ user })
    } else {
      res.status(401).json({ message: "Invalid credentials" })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  } finally {
    await client.end()
  }
}

