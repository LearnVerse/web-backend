import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  instructor: Boolean,
  partyId: String,
  serverId: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
