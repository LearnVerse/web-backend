import mongoose from 'mongoose';

const { Schema } = mongoose;

const PartySchema = new Schema({
  instructor: Object,
  students: Array,
  addresses: Array,
}, {
  toJSON: {
    virtuals: true,
  },
});

const PartyModel = mongoose.model('Party', PartySchema);

export default PartyModel;
