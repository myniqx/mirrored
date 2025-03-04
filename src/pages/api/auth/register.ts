import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@vercel/postgres"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" })
  }

  const client = createClient()
  await client.connect()

  try {
    const result = await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password], // Note: In a real application, you should hash passwords
    )

    const newUser = result.rows[0]
    // In a real application, you would create a session or JWT here
    res.status(201).json({ user: newUser })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Internal server error" })
  } finally {
    await client.end()
  }
}

