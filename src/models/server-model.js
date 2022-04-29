import mongoose from 'mongoose';

const { Schema } = mongoose;

const ServerSchema = new Schema({
  address: String,
  game: String,
  max_users: Number,
  curr_users: Number,
}, {
  toJSON: {
    virtuals: true,
  },
});

const ServerModel = mongoose.model('Server', ServerSchema);

export default ServerModel;
