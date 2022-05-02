import mongoose from 'mongoose';

const { Schema } = mongoose;

const ServerSchema = new Schema({
  address: String,
  game: String,
  maxUsers: Number,
  currUsers: Number,
  partyCode: String,
  instructor: Object,
  students: Array,
}, {
  toJSON: {
    virtuals: true,
  },
});

const ServerModel = mongoose.model('Server', ServerSchema);

export default ServerModel;
