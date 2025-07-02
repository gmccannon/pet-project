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
    const minParam = searchParams.get('min');
    const maxParam = searchParams.get('max');
    const min = minParam ? parseInt(minParam) : undefined;
    const max = maxParam ? parseInt(maxParam) : undefined;

    if (name) query.name = { $regex: name, $options: 'i' };
    if (breed) query.breed = breed;
    if (species) query.species = species;
    if (min !== undefined || max !== undefined) {
      query.age_years = {};
      if (min !== undefined && !Number.isNaN(min)) query.age_years.$gte = min;
      if (max !== undefined && !Number.isNaN(max)) query.age_years.$lte = max;

      // If both are NaN, remove age_years entirely
      if (Object.keys(query.age_years).length === 0) {
        delete query.age_years;
      }
    }

    const pets = await Pet.find(query);

    console.log(pets);
    return NextResponse.json(pets);
  } catch (error) {
    console.error('Database fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
