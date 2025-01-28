import { Router, Request, Response } from 'express';
import { Reservation, ReservationState, CheckInState } from '../models/Reservation';
import { Room } from '../models/Room';
import { SchoolDay } from '../models/SchoolDay';
import { Period } from '../models/Period';
import { User } from '../models/User';
import { getTodayStr, parseLocalDate } from './helpers';
const reservationsRouter = Router();

interface ReservationQuery {
    roomStr: string,
    dateStr: string
};

reservationsRouter.get('/reservations', async (
  req: Request<{}, {}, {}, ReservationQuery>,
  res: Response
): Promise<void> => {
  console.log(req.query);
  const { roomStr, dateStr } = req.query;
  const date = new Date(dateStr); // needs to be in current timezone
  try {
      // if date is too far in advance then reservation state is not open
      // const reservations = await Reservation.find({ room: room, date: date })
      //   .populate('user', 'email').populate('room', 'name').populate('date', 'date').exec();
      const room = await Room.findOne({name: roomStr}).exec();
      if (!room) {
        res.status(400).send({error: "Room not found: " + roomStr});
        return;
      }
      const reservations = await Reservation.find({ room: room, date: date }).populate('room', 'name').exec();
      const pageTitle = "Reservations for " + room.name + " on " + date.toDateString();
      res.json({title: pageTitle, reservations: reservations});
      // res.render("reservations", {title: pageTitle, reservations: reservations});
  } catch (error) {
      res.status(400).send(error);
  }
});

interface CreateReservationBody {
  roomStr: string;
  dateStr: string;
  periodNum: number;
  userEmail: string;
}

const BOOKING_DAYS_CONSTRAINT: number = 2;

reservationsRouter.post('/reservations', async (
  req: Request<{}, {}, CreateReservationBody, {}, {}>,
  res: Response
): Promise<void> => {
  console.log(req.body);
  try {
    const { roomStr, dateStr, periodNum, userEmail } = req.body;
    
    // Validate booking time constraints
    const bookingDate = new Date(dateStr);
    const todayStr = getTodayStr();
    const todayObj = parseLocalDate(todayStr);
    const maxDateObj = new Date(todayObj);
    maxDateObj.setDate(maxDateObj.getDate() + BOOKING_DAYS_CONSTRAINT);
    if (bookingDate > maxDateObj) {
      res.status(400).send({error: "Booking date is invalid"});
      return;
    }
    
    // Check for existing reservation
    const room = await Room.findOne({name: roomStr}).exec();
    const schoolDay = await SchoolDay.findOne({date: new Date(dateStr)}).exec();
    // const period = await Period.findOne({number: periodNum}).exec();
    let existingReservation = await Reservation.findOne({
      room: room,
      date: schoolDay,
      period: periodNum
    }).exec();

    if (existingReservation != null) {
      res.status(400).send({error: "Reservation already exists"});
      return;
    }
    
    const user = await User.findOne({email: userEmail}).exec();
    if (!user) {
      res.status(400).send({error: "User not found: " + userEmail});
      return;
    }

    const reservation = new Reservation({
      room,
      reserved: { Reserved: true },
      checkIn: { Pending: true },
      user: user.id,
      date: schoolDay,
      period: periodNum
    });
    await reservation.save();
    res.status(200).send(reservation);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default reservationsRouter;