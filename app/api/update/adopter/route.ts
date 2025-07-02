import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { adopterSchema } from '@/lib/schemas/adopter';

const UpdateAdopterSchema = z.object({
  _id: z.string().length(24, 'must be the MongoDB ObjectId'),
  city: z.string().optional(),
  previous_pets: z.number().int().nonnegative().optional(),
});


const AdopterModel = mongoose.models.Adopter || mongoose.model('Adopter', adopterSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, { dbName: 'your-db-name' });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const json = await request.json();
    const result = UpdateAdopterSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
    }

    const { _id, ...updates } = result.data;
    const updated = await AdopterModel.findByIdAndUpdate(_id, updates, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Adopter not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Adopter updated', adopter: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
