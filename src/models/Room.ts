import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export const Room = mongoose.model('Room', RoomSchema);