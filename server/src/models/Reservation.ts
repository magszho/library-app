import mongoose from 'mongoose';
import { User } from './User';
import { Period } from './Period';
import { Room } from './Room';

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
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // reserved: {
  //   type: String,
  //   required: true,
  //   enum: Object.values(ReservationState),
  //   default: ReservationState.NotOpen,
  // },
  // checkin: {
  //   type: String,
  //   required: true,
  //   enum: Object.values(CheckInState),
  //   default: CheckInState.Pending,
  // },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  },
  date: { 
    type: Date, 
    required: true 
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

export { ReservationState };
export { CheckInState };
export const Reservation = mongoose.model('Reservation', ReservationSchema);