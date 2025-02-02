import mongoose from 'mongoose';
import { User } from './User';
import { Room } from './Room';

const ReservationSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Room',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  },
  date: { 
    type: Date, 
    required: true,
  },
  period: { 
    type: Number,
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Reservation = mongoose.model('Reservation', ReservationSchema);