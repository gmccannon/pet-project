import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

type QueryValue = string | number | { $regex: string; $options: string; }

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

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name')?.trim();
    const breed = searchParams.get('breed')?.trim();
    const species = searchParams.get('species')?.trim();
    const age = searchParams.get('age')?.trim();

    const query: Record<string, QueryValue> = {};
    if (name) { query.name = { $regex: name, $options: 'i' }; } // fuzzy case-insensitive
    if (breed) query.breed = breed;
    if (species) query.species = species;
    if (age) query.age_years = parseInt(age);

    const pets = await Pet.find(query);

    return NextResponse.json(pets);
  } catch (error) {
    console.error('Database fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
