import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';

const PetSchema = z.object({
  name: z.string(),
  species: z.string(),
  breed: z.string().optional(),
  age_years: z.number().optional(),
  gender: z.string().optional(),
  color: z.string().optional(),
  arrival_date: z.coerce.date().optional(),
  adoption: z.object({
    status: z.boolean(),
    date: z.coerce.date().nullable().optional(),
    adopter_id: z.string().optional(),
  }),
});

export type Pet = z.infer<typeof PetSchema>;

const petSchema = new mongoose.Schema({}, { strict: false });
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
      return NextResponse.json({ error: 'Invalid input caught by zod', details: result.error.flatten() }, { status: 400 });
    }

    const newPet = new PetModel(result.data);
    await newPet.save();

    return NextResponse.json({ message: 'Pet added successfully', pet: newPet }, { status: 201 });
  } catch (error: any) {
    console.error('Pet insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
