import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

type QueryValue = string | number | { $regex: string; $options: string; }

const adopterSchema = new mongoose.Schema({}, { strict: false });
const Adopter = mongoose.models.Adopter || mongoose.model('Adopter', adopterSchema);

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
    const city = searchParams.get('city')?.trim();
    const age = searchParams.get('age')?.trim();
    const previousPets = searchParams.get('previous_pets')?.trim();

    const query: Record<string, QueryValue> = {};
    if (name) { query.name = { $regex: name, $options: 'i' }; } // fuzzy case-insensitive
    if (city) query.city = city;
    if (age) query.age = parseInt(age);
    if (previousPets) query.previous_pets = parseInt(previousPets);

    const adopters = await Adopter.find(query);
    return NextResponse.json(adopters);
  } catch (error) {
    console.error('Adopter fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch adopters' }, { status: 500 });
  }
}
