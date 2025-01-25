import mongoose from 'mongoose';

const PeriodSchema = new mongoose.Schema({
  number: { 
    type: Number, 
    required: true,
    min: 1,
    max: 8
  }
});

export const Period = mongoose.model('Period', PeriodSchema);