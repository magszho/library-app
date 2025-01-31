export interface Room {
  _id: string;
  name: string;
}

export interface Reservation {
  _id: string;
  room: Room;
  date: Date;
  period: Number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface BookingRequest {
  roomStr: string;
  dateStr: string;
  periodNum: number;
  userEmail: string;
} 