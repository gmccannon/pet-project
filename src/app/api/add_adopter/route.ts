import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';

export const AdopterSchema = z.object({
  adopter_email: z.string().email(),
  name: z.string(),
  age: z.number().optional(),
  city: z.string().optional(),
  previous_pets: z.number().optional()
});

const adopterSchema = new mongoose.Schema({
  adopter_email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number },
  city: { type: String },
  previous_pets: { type: Number },
});

export type Adopter = z.infer<typeof AdopterSchema>;

const Adopter = mongoose.models.Adopter || mongoose.model('Adopter', adopterSchema);

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

    const result = AdopterSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
    }

    const existing = await Adopter.findOne({ adopter_email: json.adopter_email });
    if (existing) {
      return NextResponse.json({ error: 'Adopter email already exists' }, { status: 409 });
    }

    const newAdopter = new Adopter(result.data);
    await newAdopter.save();

    return NextResponse.json({ message: 'Adopter added successfully', adopter: newAdopter }, { status: 201 });
  } catch (error: any) {
    console.error('Adopter insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
