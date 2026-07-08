// src/models/adoption.model.js
import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
    user: { type: String, required: true },
    pet: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    date: { type: Date, default: Date.now }
});

export const AdoptionModel = mongoose.model('adoptions', adoptionSchema);