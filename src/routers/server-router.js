import express from 'express';
import Server from '../controllers/server-controller';
import { generateResponse, handleError, RESPONSE_TYPES } from '../constants';

const router = express();

router.route('/createParty')
  .post(async (req, res) => {
    try {
      const { name, game, numPlayers } = req.body;
      const temp = await Server.createParty(name, game, numPlayers);
      if (temp) res.send(generateResponse(RESPONSE_TYPES.SUCCESS, temp));
    } catch (error) { handleError(res, error); }
  });

router.route('/joinPartyAsStudent')
  .post(async (req, res) => {
    try {
      const { name, partyCode } = req.body;
      const address = await Server.joinPartyAsStudent(name, partyCode);
      if (address) res.send(generateResponse(RESPONSE_TYPES.SUCCESS, address));
    } catch (error) { handleError(res, error); }
  });

router.route('/leavePartyAsStudent')
  .delete(async (req, res) => {
    try {
      const { studentId } = req.body;
      const leftSuccessfully = await Server.leavePartyAsStudent(studentId);
      if (leftSuccessfully) res.send(generateResponse(RESPONSE_TYPES.SUCCESS));
    } catch (error) { handleError(res, error); }
  });

router.route('/getAllPartyMembers')
  .get(async (req, res) => {
    try {
      const { partyCode } = req.body;
      const partyMembers = await Server.getAllPartyMembers(partyCode);
      if (partyMembers) res.send(generateResponse(RESPONSE_TYPES.SUCCESS, partyMembers));
    } catch (error) { handleError(res, error); }
  });

export default router;
