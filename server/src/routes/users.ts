import mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { User } from '../models/User';

const userRouter = Router();

// Get user info
userRouter.get('/users/:userId', async (
    req: Request<{userId: string}, {}, {}, {}>, 
    res: Response
): Promise<void> => {
const { userId } = req.params;
try {
    const user = await User.findById(userId);
    if (!user) {
    res.status(404).send({ message: 'User not found' });
        return;
    }
    res.status(200).send(user);
} catch (error) {
    res.status(500).send({ error: 'Error occurred while finding user' });
}
});

userRouter.post('/users', async (req: Request<{}, {}, {firstName: string, lastName: string, email: string}, {}, {}>, res: Response) => {
    const { firstName, lastName, email } = req.body;
    const user = await User.findOne({ email: email }).exec();
    if (user) {
        res.status(400).send({ error: 'User with email ' + email + ' already exists' });
        return;
    }
    const newUser = new User({ firstName: firstName, lastName: lastName, email: email });
    await newUser.save();
    res.status(200).json(newUser);
});
  
export default userRouter;