import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { petSchema } from '@/lib/schemas/pet';

const DeletePetSchema = z.object({
  _id: z.string().length(24, 'must be the MongoDB ObjectId')
});

const PetModel = mongoose.models.Pet || mongoose.model('Pet', petSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'your-db-name',
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const json = await request.json();

    const result = DeletePetSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
    }

    const deleted = await PetModel.findByIdAndDelete(result.data._id);

    if (!deleted) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pet removed successfully', pet: deleted }, { status: 200 });
  } catch (error: any) {
    console.error('Pet delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
