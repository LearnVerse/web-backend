import express from 'express';
import User from '../controllers/user-controller';
import { generateResponse, handleError, RESPONSE_TYPES } from '../constants';

const router = express();

router.route('/:userId')
  .get(async (req, res) => {
    try {
      const { userId } = req.params;
      const isInstructor = await User.getInstructorStatus(userId);
      if (isInstructor) res.send(generateResponse(RESPONSE_TYPES.SUCCESS, isInstructor));
    } catch (error) { handleError(res, error); }
  });

export default router;
