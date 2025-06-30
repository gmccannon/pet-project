import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { PetSchema, petSchema } from '@/lib/schemas/pet';

const PetModel = mongoose.models.Pet || mongoose.model('Pet', petSchema);

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
    const json = await request.json();

    const result = PetSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
    }

    const newPet = new PetModel(result.data);
    await newPet.save();

    return NextResponse.json({ message: 'Pet added successfully', pet: newPet }, { status: 201 });
  } catch (error: any) {
    console.error('Pet insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
