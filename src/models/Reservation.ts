import mongoose from 'mongoose';
import { User } from './User';
import { Period } from './Period';
import { Room } from './Room';
import { SchoolDay } from './SchoolDay';

enum ReservationState {
  NotOpen = "Not Open", // before 2 days before booking becomes available
  Available = "Available",
  Reserved = "Reserved",
}

enum CheckInState {
  Pending = "Pending",
  CheckedIn = "Checked In",
  CheckedOut = "Checked Out",
}

const ReservationSchema = new mongoose.Schema({
  room: { 
    type: Room, 
    required: true 
  },
  reserved: {
    type: ReservationState,
    required: true,
    default: ReservationState.NotOpen,
  },
  checkin: { // only used when reserved
    type: CheckInState,
    required: true,
    default: CheckInState.Pending,
  },
  user: {
    type: User,
    required: false,
  },
  date: { 
    type: SchoolDay, 
    required: true 
  },
  period: { 
    type: Period,
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Reservation = mongoose.model('Reservation', ReservationSchema);