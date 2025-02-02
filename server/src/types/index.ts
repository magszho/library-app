const mongoose = require('mongoose');

export interface IUser {
    id: mongoose.Schema.Types.ObjectId;
    email: string;
}

enum ReservationState {
    Pending = "Pending",
    Checked_In = "Checked In",
    Checked_Out = "Checked Out",
}
  
export interface IReservation {
    id: mongoose.Schema.Types.ObjectId;
    room: string;
    user: IUser | string;
    date: Date;
    period: number;
    createdAt: Date;
    state: ReservationState;
}