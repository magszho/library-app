import mongoose from 'mongoose';
import { Period } from './Period';

const SchoolDaySchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true,
  },
  periods: {
    type: Array<typeof Period>(8),
  }
});

export const SchoolDay = mongoose.model('SchoolDay', SchoolDaySchema);