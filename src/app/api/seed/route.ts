import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import seedData from '@/app/api/seed/seeddata.json'

// Define schema
const petSchema = new mongoose.Schema({}, { strict: false })
const Pet = mongoose.models.Pet || mongoose.model('Pet', petSchema)

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect("mongodb+srv://straytabase_admin:Qd8q4eCNCzS%3B%3F%5DN@straytabase.ehtrs0e.mongodb.net/?retryWrites=true&w=majority&appName=StrayTaBase", {
      dbName: 'your-db-name',
    })
  }
}

export async function POST() {
  try {
    await connectDB()

    // clear collection before seeding
    await Pet.deleteMany({})

    // Insert seed data
    await Pet.insertMany(seedData)

    return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
