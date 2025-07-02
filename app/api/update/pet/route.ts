import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { petSchema } from '@/lib/schemas/pet';

const UpdatePetSchema = z.object({
  _id: z.string().length(24, 'must be the MongoDB ObjectId')
}).passthrough();

const PetModel = mongoose.models.Pet || mongoose.model('Pet', petSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, { dbName: 'your-db-name' });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const json = await request.json();
    const result = UpdatePetSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
    }

    const { _id, ...updates } = result.data;
    const updated = await PetModel.findByIdAndUpdate(_id, updates, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pet updated', pet: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
