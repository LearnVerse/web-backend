import express from 'express';
import Server from '../controllers/server-controller';
import { generateResponse, RESPONSE_TYPES } from '../constants';

const router = express();

router.route('/')
  .get(async (req, res) => {
    try {
      const servers = await Server.getServers();
      if (servers) {
        res.send(generateResponse(RESPONSE_TYPES.SUCCESS, servers));
      }
    } catch (error) {
      console.log(error);
      res.status(error.code.status).send(
        generateResponse(error.code.type, error.message),
      );
    }
  });

export default router;
