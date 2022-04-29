import mongoose, { Schema } from 'mongoose';

const ServerScheme = new Schema({
  address: String,
  game: String,
  max_users: Number,
  curr_users: Number,
}, {
  toJSON: {
    virtuals: true,
  },
});

const ServerModel = mongoose.model('Server', ServerScheme);

export default ServerModel;
