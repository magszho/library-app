import { Router, Request, Response } from 'express';
import { Reservation } from '../models/Reservation';
import { Room } from '../models/Room';
import { User, IUser } from '../models/User';
import { getTodayStr, parseLocalDate, getDateStr } from './helpers';
import { authenticateToken } from '../middleware/auth';

const reservationsRouter = Router();

interface ReservationQuery {
    roomStr: string,
    dateStr: string,
};

reservationsRouter.get('/reservations', async (
  req: Request<{}, {}, {}, ReservationQuery>,
  res: Response
): Promise<void> => {
  const { roomStr, dateStr } = req.query;
  console.log(roomStr, dateStr);
  const date = new Date(dateStr);
  console.log("Date:", date);
  try {
      // if date is too far in advance then reservation state is not open
      // const reservations = await Reservation.find({ room: room, date: date })
      //   .populate('user', 'email').populate('room', 'name').populate('date', 'date').exec();
      const room = await Room.findOne({name: roomStr}).exec();
      if (!room) {
        res.status(400).send({error: "Room not found: " + roomStr});
        return;
      }
      const reservations = await Reservation.find({ room: room, date: date }).populate('room').populate('user').exec();
      console.log("Reservations for " + room.name + " on " + dateStr);
      res.json(reservations);
      // res.render("reservations", {title: pageTitle, reservations: reservations});
  } catch (error) {
      res.status(400).send(error);
  }
});

interface CreateReservationBody {
  roomStr: string;
  dateStr: string;
  periodNum: number;
}

const BOOKING_DAYS_CONSTRAINT: number = 2;

// Create reservation - requires authentication
reservationsRouter.post('/reservations', authenticateToken, async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Received request body:", req.body);
  console.log("Received request user:", req.userId);
  try {
    const { roomStr, dateStr, periodNum } = req.body;
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).send({ error: "Authentication required" });
      return;
    }

    console.log("Room:", roomStr);
    console.log("Date:", dateStr);
    console.log("Period:", periodNum);

    const userObj = await User.findById(userId).exec() as IUser | null;
    if (!userObj) {
      res.status(400).send({error: "User not found"});
      return;
    }

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
    let existingReservation = await Reservation.findOne({
      room: room,
      date: bookingDate,
      period: periodNum
    }).exec();

    if (existingReservation) {
      res.status(400).send({error: "Reservation already exists"});
      return;
    }

    const reservation = new Reservation({
      room: room,
      user: userObj._id,
      date: bookingDate,
      period: periodNum
    });
    
    await reservation.save();
    res.status(200).send(reservation);
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(400).send(error);
  }
});

export default reservationsRouter;