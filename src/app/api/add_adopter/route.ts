import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';

export const AdopterSchema = z.object({
  adopter_id: z.string().email(),
  name: z.string().optional(),
  age: z.number().optional(),
  city: z.string().optional(),
  previous_pets: z.number().optional()
});

export type Adopter = z.infer<typeof AdopterSchema>;

const adopterSchema = new mongoose.Schema({ ...AdopterSchema });
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
      return NextResponse.json({ error: 'Invalid input caught by zod', details: result.error.flatten() }, { status: 400 });
    }

    const existing = await Adopter.findOne({ adopter_id: json.adopter_id });
    if (existing) {
      return NextResponse.json({ error: 'Adopter ID already exists' }, { status: 409 });
    }

    const newAdopter = new Adopter(result);
    await newAdopter.save();

    return NextResponse.json({ message: 'Adopter added successfully', adopter: newAdopter }, { status: 201 });
  } catch (error: any) {
    console.error('Adopter insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
