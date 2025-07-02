import mongoose from "mongoose";
import { z } from "zod";

const adopterSchema = new mongoose.Schema({
  adopter_email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number },
  city: { type: String },
  previous_pets: { type: Number },
});

export const AdopterSchema = z.object({
  adopter_email: z.string().email(),
  name: z.string(),
  age: z.number().optional(),
  city: z.string().optional(),
  previous_pets: z.number().optional()
});

export type Adopter = z.infer<typeof AdopterSchema>;

export { adopterSchema };
