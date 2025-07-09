import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const uri = process.env.MONGODB_URI!
const client = new MongoClient(uri)

async function getUser(email: string) {
  await client.connect()
  const user = await client.db("your-db-name").collection("users").findOne({ email })
  return user
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await getUser(credentials!.email)
        if (user && bcrypt.compareSync(credentials!.password, user.password)) {
          return { id: user._id.toString(), email: user.email }
        }
        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
})

export const GET = handler
export const POST = handler

