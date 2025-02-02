import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  googleId: string;
}

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  googleId: { 
    type: String, 
    required: true,
    unique: true  // Add unique constraint
  }
}, {
  // Disable the automatic 'id' virtual
  id: false
});

export const User = mongoose.model<IUser>('User', userSchema);