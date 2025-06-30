import mongoose from "mongoose";
import { z } from "zod";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  age_years: { type: Number },
  gender: { type: String },
  color: { type: String },
  arrival_date: { type: Date },
  adoption: {
    status: { type: Boolean, required: true },
    date: { type: Date },
    adopter_email: { type: String }
  }
});

export const PetSchema = z.object({
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
    adopter_email: z.string().optional(),
  }),
});

export type Pet = z.infer<typeof PetSchema>;

export { petSchema };
