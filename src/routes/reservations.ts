import { Router, Request, Response } from 'express';
import { Reservation } from '../models/Reservation';

const router = Router();

interface ReservationQuery {
    room: string,
    dateStr: string
};

// Get all reservations for a specific room and date
router.get('/reservations', async (
  req: Request<{}, {}, {}, ReservationQuery>,
  res: Response
): Promise<void> => {
  const { room, dateStr } = req.query;
  const date: Date = new Date(dateStr);
  try {
    const reservations = await Reservation.find({ room: room, date: date })
      .populate('user', 'email').populate('room', 'name').populate('date', 'date').exec();
    const pageTitle = "Reservations for " + room + " on " + date.toDateString();
    res.status(200).render("reservations", {title: pageTitle, reservations: reservations});
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;