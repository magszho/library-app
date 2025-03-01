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

userRouter.get('/users', async (req: Request<{}, {}, {}, {email?: string}>, res: Response): Promise<void> => {
    try {
        let query = {};
        if (req.query.email) {
            query = { email: req.query.email };
        }
        const users = await User.find(query).exec();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: 'Error ocurred while finding user' });
    }
});

// userRouter.get('/users', async (req: Request<{}, {}, {}, {}>, res: Response): Promise<void> => {
//     try {
//         const users = await User.find({}).exec();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).send({ error: 'Error occurred while finding users' });
//     }
// });

userRouter.post('/users', async (req: Request<{}, {}, {name: string, email: string}, {}, {}>, res: Response) => {
    const { name, email } = req.body;
    const user = await User.findOne({ email: email }).exec();
    if (user) {
        res.status(400).send({ error: 'User with email ' + email + ' already exists' });
        return;
    }
    const newUser = new User({ name: name, email: email });
    await newUser.save();
    res.status(200).json(newUser);
});
  
export default userRouter;