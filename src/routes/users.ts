import mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import { User } from '../models/User';

const router = Router();

interface UserParams {
    id: mongoose.Schema.Types.ObjectId
};

// Get user info
router.get('/users/:userId', async (
    req: Request<UserParams, {}, {}, {}>, 
    res: Response
): Promise<void> => {
const { id } = req.params;
try {
    const user = await User.findById(id);
    if (!user) {
    res.status(404).send({ message: 'User not found' });
        return;
    }
    res.status(200).send(user);
} catch (error) {
    res.status(500).send({ error: 'Error occurred while finding user' });
}
});
  
export default router;