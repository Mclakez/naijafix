export type UserSchemaProps = {
  username: string
  googleId?: string
  email: string
  password?: string
  role: "user" | "officer" | "admin"
  department: string | null
  createdAt: Date
  suspension: "active" | "suspended"
  suspendedUntil: Date | null
  lastSeen: Date
  userImage: string | null
}

type User