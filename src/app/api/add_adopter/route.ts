import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const adopterSchema = new mongoose.Schema({}, { strict: false });
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
    const data = await request.json();

    // Validation
    if (!data.adopter_id || !data.name) {
      return NextResponse.json({ error: 'Missing adopter fields' }, { status: 400 });
    }

    const existing = await Adopter.findOne({ adopter_id: data.adopter_id });
    if (existing) {
      return NextResponse.json({ error: 'Adopter ID already exists' }, { status: 409 });
    }

    const newAdopter = new Adopter(data);
    await newAdopter.save();

    return NextResponse.json({ message: 'Adopter added successfully', adopter: newAdopter }, { status: 201 });
  } catch (error: any) {
    console.error('Adopter insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
