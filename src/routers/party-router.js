import express from 'express';
import Party from '../controllers/party-controller';
import { generateResponse, handleError, RESPONSE_TYPES } from '../constants';

const router = express();

router.route('/create')
  .post(async (req, res) => {
    try {
      const { name, game, numPlayers } = req.body;
      const partyInfo = await Party.createParty(name, game, numPlayers);
      if (partyInfo) res.send(generateResponse(RESPONSE_TYPES.SUCCESS, partyInfo));
    } catch (error) { handleError(res, error); }
  });

router.route('/:partyId/joinPartyAsStudent')
  .post(async (req, res) => {
    try {
      const { partyId } = req.params;
      const { name } = req.body;
      const { userId, address } = await Party.joinPartyAsStudent(name, partyId);
      if (address) res.send(generateResponse(RESPONSE_TYPES.SUCCESS, { userId, address }));
    } catch (error) { handleError(res, error); }
  });

router.route('/:partyId/leavePartyAsStudent')
  .delete(async (req, res) => {
    try {
      const { studentId } = req.body;
      const leftSuccessfully = await Party.leavePartyAsStudent(studentId);
      if (leftSuccessfully) res.send(generateResponse(RESPONSE_TYPES.SUCCESS));
    } catch (error) { handleError(res, error); }
  });

router.route('/:partyId/getAllMembers')
  .get(async (req, res) => {
    try {
      const { partyId } = req.params;
      const partyMembers = await Party.getAllPartyMembers(partyId);
      if (partyMembers) res.send(generateResponse(RESPONSE_TYPES.SUCCESS, partyMembers));
    } catch (error) { handleError(res, error); }
  });

router.route('/:partyId')
  .get(async (req, res) => {
    try {
      const { partyId } = req.params;
      const partyInfo = await Party.getPartyGame(partyId);
      if (partyInfo) res.send(generateResponse(RESPONSE_TYPES.SUCCESS, partyInfo));
    } catch (error) { handleError(res, error); }
  });

export default router;
