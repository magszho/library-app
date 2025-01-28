import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Reservation } from './models/Reservation';
import { Room } from './models/Room';


dotenv.config();

import { db } from './db';
import reservationsRouter from './routes/reservations';
import roomRouter from './routes/rooms';
import usersRouter from './routes/users';

const app: Express = express();
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.once('open', () => {
    console.log("Database connected");
});
const port = process.env.PORT || 5000;

// app.use(express.static(path.join(__dirname, '../static')));
app.get("/test", (req: Request, res: Response) => {
    res.send("here's a silly message");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'website.html'));
});

interface ReservationQuery {
    roomStr: string,
    date: Date
};

app.use("/", reservationsRouter);
app.use("/", roomRouter);   
app.use("/", usersRouter);
// app.get('/reservations', async (
//     req: Request<{}, {}, {}, ReservationQuery>,
//     res: Response
// ): Promise<void> => {
//     console.log("hi received this route");
//     const { roomStr, date } = req.query;
//     // const roomStr = "101";
//     // const date: Date = new Date("2025-01-24");
//     try {
//         // if date is too far in advance then reservation state is not open
//         // const reservations = await Reservation.find({ room: room, date: date })
//         //   .populate('user', 'email').populate('room', 'name').populate('date', 'date').exec();
//         const room = await Room.findOne({name: roomStr}).exec();
//         // if (!room) {
//         //     res.status(400).send({error: "Room not found: " + roomStr});
//         //     return;
//         //   }
//         const reservations = await Reservation.find({ room: room, date: date }).exec();
//         const pageTitle = "Reservations for " + room + " on " + date.toDateString();
//         res.json({title: pageTitle, reservations: reservations});
//         // res.render("reservations", {title: pageTitle, reservations: reservations});
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });


app.listen(port, () => {
console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;