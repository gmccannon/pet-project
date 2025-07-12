import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Define a simple user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'your-db-name',
    })
  }
}

export async function POST() {
  try {
    await connectDB()

    // Clear users collection
    await User.deleteMany({})

    // Create sample users
    const users = [
      {
        email: 'george@email.com',
        password: bcrypt.hashSync('mavis2010', 10),
      },
      {
        email: 'matt@email.com',
        password: bcrypt.hashSync('matt123', 10),
      },
    ]

    await User.insertMany(users)

    return NextResponse.json({ message: 'Users added successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
