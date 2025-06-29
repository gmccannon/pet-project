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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    // Validation, I assume that the only required field we want are name and species
    if (!data.name || !data.species) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPet = new Pet(data);
    await newPet.save();

    return NextResponse.json({ message: 'Pet added successfully', pet: newPet }, { status: 201 });
  } catch (error: any) {
    console.error('Pet insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
