import User from '../models/user-model';
import {
  generateError, RESPONSE_CODES,
} from '../constants';

const getInstructorStatus = async (userId) => {
  try {
    // verify that call includes all parameters
    if (!userId) throw generateError('Please specify a user ID', RESPONSE_CODES.BAD_REQUEST);

    // find user
    const user = await User.findById(userId);
    if (!user) throw generateError('User not found', RESPONSE_CODES.NOT_FOUND);

    // respond with boolean for whether user is instructor
    return user.instructor;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const user = { getInstructorStatus };

export default user;
