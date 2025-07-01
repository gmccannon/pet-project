import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

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
    const query: any = {};

    const name = searchParams.get('name')?.trim();
    const breed = searchParams.get('breed')?.trim();
    const species = searchParams.get('species')?.trim();
    const min = parseInt(searchParams.get('min') || '');
    const max = parseInt(searchParams.get('max') || '');

    if (name) query.name = { $regex: name, $options: 'i' };
    if (breed) query.breed = breed;
    if (species) query.species = species;
    if (min !== undefined || max !== undefined) {
      query.age_years = {};
      if (min !== undefined) query.age_years.$gte = min;
      if (max !== undefined) query.age_years.$lte = max;
    }

    const pets = await Pet.find(query);
    return NextResponse.json(pets);
  } catch (error) {
    console.error('Database fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
