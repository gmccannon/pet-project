import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { adopterSchema } from '@/lib/schemas/adopter';

const DeleteAdopterSchema = z.object({
  _id: z.string().length(24, 'must be the MongoDB ObjectId')
});

const Adopter = mongoose.model('Adopter', adopterSchema);

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

    const result = DeleteAdopterSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
    }

    const deleted = await Adopter.findByIdAndDelete(result.data._id);

    if (!deleted) {
      return NextResponse.json({ error: 'Adopter not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Adopter removed successfully', adopter: deleted }, { status: 200 });
  } catch (error: any) {
    console.error('Adopter delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
