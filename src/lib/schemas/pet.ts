import mongoose from "mongoose";

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

export default petSchema;
