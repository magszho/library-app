import { Router, Request, Response } from 'express';
import { Room } from '../models/Room';
import { ObjectId } from 'mongoose';

const roomRouter = Router();

interface CreateRoomBody {
  roomName: string;
}

roomRouter.get('/rooms/:roomId', async (req: Request<{roomId: ObjectId}, {}, {}, {}>, res: Response) => {
  try {
      const room = await Room.findById(req.params.roomId).exec();
      res.status(200).json(room);
  } catch (error) {
      res.status(400).json({ error: 'Failed to fetch room ' + req.params.roomId });
  }
});

roomRouter.get('/rooms', async (req: Request<{}, {}, {}, {roomName: string}>, res: Response) => {
    try {
        const room = await Room.findOne({name: req.query.roomName}).exec();
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch room ' + req.query.roomName });
    }
});

roomRouter.post('/rooms', async (req: Request<{}, {}, CreateRoomBody, {}, {}>, res: Response) => {
  try {
    const { roomName } = req.body;
    // Check if room already exists
    const existingRoom = await Room.findOne({ name: roomName }).exec();
    if (existingRoom) {
      return res.status(400).json({ error: 'Room already exists' });
    }

    const room = new Room({ name: roomName });
    await room.save();  
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create room' });
  }
});

export default roomRouter;