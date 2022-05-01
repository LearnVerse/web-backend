import express from 'express';
import Server from '../controllers/server-controller';
import { generateResponse, RESPONSE_TYPES } from '../constants';

const router = express();

router.route('/createParty')
  .get(async (req, res) => {
    try {
      const { name, game, numPlayers } = req.query;
      const temp = await Server.createParty(name, game, numPlayers);
      if (temp) {
        res.send(generateResponse(RESPONSE_TYPES.SUCCESS, temp));
      }
    } catch (error) {
      console.log(error);
      res.status(error.code.status).send(
        generateResponse(error.code.type, error.message),
      );
    }
  });

router.route('/joinPartyAsStudent')
  // Queries servers and finds an available one
  .get(async (req, res) => {
    try {
      const { name, partyCode } = req.query;
      const address = await Server.joinPartyAsStudent(name, partyCode);
      if (address) {
        res.send(generateResponse(RESPONSE_TYPES.SUCCESS, address));
      }
    } catch (error) {
      console.log(error);
      res.status(error.code.status).send(
        generateResponse(error.code.type, error.message),
      );
    }
  });

export default router;
