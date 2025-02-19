import { https } from 'firebase-functions'
import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Reservation } from './models/Reservation';
import { Room } from './models/Room';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import configurePassport from './config/passport';
dotenv.config();

import { db, mongoURL } from './db';
import reservationsRouter from './routes/reservations';
import roomRouter from './routes/rooms';
import usersRouter from './routes/users';
import authRouter from './routes/auth';

const app: Express = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ 
//     mongoUrl: mongoURL,
//     collectionName: 'sessions'
//   }),
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// configurePassport(passport);

db.once('open', () => {
    console.log("Database connected");
});

const port = process.env.PORT || 8080;

// app.use(express.static(path.join(__dirname, '../static')));
app.get("/test", (req: Request, res: Response) => {
    res.send("here's a silly message");
});

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../static', 'website.html'));
// });

interface ReservationQuery {
    roomStr: string,
    date: Date
};

app.use("/", reservationsRouter);
app.use("/", roomRouter);
app.use("/", usersRouter);
app.use("/", authRouter);

app.listen(port, () => {
console.log(`[server]: Server is running at http://localhost:${port}`);
});

// export default app;
export const api = https.onRequest(app);
