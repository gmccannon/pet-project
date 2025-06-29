import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import petsData from '@/app/api/seed/normalized_pets.json'
import adoptersData from '@/app/api/seed/normalized_adopters.json'

// Pet schema
const petSchema = new mongoose.Schema({}, { strict: false })
const Pet = mongoose.models.Pet || mongoose.model('Pet', petSchema)

// Adopter schema
const adopterSchema = new mongoose.Schema({}, { strict: false })
const Adopter = mongoose.models.Adopter || mongoose.model('Adopter', adopterSchema)

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'your-db-name',
    });
  }
}

export async function POST() {
  try {
    await connectDB()

    // Clear database
    await Pet.deleteMany({})
    await Adopter.deleteMany({})

    // Populate database
    await Pet.insertMany(petsData)
    await Adopter.insertMany(adoptersData)

    return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
