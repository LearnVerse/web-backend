import mongoose from 'mongoose';

const { Schema } = mongoose;

const PartySchema = new Schema({
  game: String,
  playing: Boolean,
  playVideo: Boolean,
  serverIds: [String],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

const PartyModel = mongoose.model('Party', PartySchema);

export default PartyModel;
