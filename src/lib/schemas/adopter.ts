import mongoose from "mongoose";

const adopterSchema = new mongoose.Schema({
  adopter_email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number },
  city: { type: String },
  previous_pets: { type: Number },
});

export default adopterSchema;
