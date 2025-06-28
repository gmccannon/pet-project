// app/api/pets/route.ts (or similar path)

import { NextRequest, NextResponse } from 'next/server';
import mongoose, { mongo } from 'mongoose';

// Define a simple schema (adjust based on your actual data)
const petSchema = new mongoose.Schema({}, { strict: false });
const Pet = mongoose.models.Pet || mongoose.model('Pet', petSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'your-db-name',
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const pets = await Pet.find({pet_name : request.nextUrl.searchParams.get('name')});

        console.log(pets);

    return NextResponse.json(pets); // Return as JSON
  } catch (error) {
    console.error('Database fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
