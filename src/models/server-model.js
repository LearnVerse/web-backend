import mongoose from 'mongoose';

const { Schema } = mongoose;

const ServerSchema = new Schema({
  address: String,
  game: String,
  maxUsers: Number,
  currUsers: Number,
  partyId: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

const ServerModel = mongoose.model('Server', ServerSchema);

export default ServerModel;
