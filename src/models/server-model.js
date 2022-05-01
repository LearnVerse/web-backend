import mongoose from 'mongoose';

const { Schema } = mongoose;

const ServerSchema = new Schema({
  address: String,
  game: String,
  maxUsers: Number,
  currUsers: Number,
  partyCode: String,
  instructor: mongoose.Schema.Types.ObjectId,
  students: Array,
}, {
  toJSON: {
    virtuals: true,
  },
});

const ServerModel = mongoose.model('Server', ServerSchema);

export default ServerModel;
