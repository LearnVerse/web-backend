import Server from '../models/server-model';
import User from '../models/user-model';
import Party from '../models/party-model';
import {
  generateError, RESPONSE_CODES, NO_PARTY_CODE, GAME_PLAYER_LIMITS,
} from '../constants';

/**
 * Create party and instructor objects in the database, assign them to each other, and allocate servers for the party
 * @param {string} name - the name of the instructor
 * @param {string} game - the game the party is playing
 * @param {number} numPlayers - the number of players in the party, must be an integer
 * @returns id of party object in db
 */
const createParty = async (name, game, numPlayers) => {
  try {
    // verify that call includes all parameters
    if (!name || !game || !numPlayers) throw generateError('Please specify a name, game, and number of players', RESPONSE_CODES.BAD_REQUEST);

    // create object for party in db
    const party = new Party({
      game,
      playing: false,
      playVideo: false,
    });
    if (!party) throw generateError('Couldn\'t create object for party in the database', RESPONSE_CODES.INTERNAL_ERROR);

    // create object for instructor in db
    const instructor = new User({
      name,
      instructor: true,
      partyId: party.id,
    });
    if (!instructor) throw generateError('Couldn\'t create object for instructor in the database', RESPONSE_CODES.INTERNAL_ERROR);

    // find available servers in db
    const numServersNeeded = Math.ceil(numPlayers / GAME_PLAYER_LIMITS[game]);
    const availableServers = await Server.find({ game, partyId: NO_PARTY_CODE });
    if (!availableServers) throw generateError('Couldn\'t find servers for party', RESPONSE_CODES.NOT_FOUND);

    // allocate sufficient servers or warn if unable
    if (availableServers.length < numServersNeeded) throw generateError('Not enough servers currently available for this party', RESPONSE_CODES.NOT_FOUND);
    const partyServers = availableServers.slice(0, numServersNeeded);

    // set partyId in each of the selected servers
    // + store server addresses in party and variable to send in response
    const addresses = [];
    partyServers.forEach((server) => {
      server.partyId = party.id;
      server.save();
      party.serverIds.push(server.id);
      addresses.push(server.address);
    });
    instructor.save();
    party.save();

    // respond with id for party object in db
    return { partyId: party.id, userId: instructor.id, addresses };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Create a student object in the database, assign it to a server, and add the student to the party
 * @param {string} name - the name of the student
 * @param {string} partyId - the party code that the student is trying to join
 * @returns address of server student was assigned to
 */
const joinPartyAsStudent = async (name, partyId) => {
  try {
    // verify that call includes all parameters
    if (!name || !partyId) throw generateError('Please specify a name and party code', RESPONSE_CODES.BAD_REQUEST);

    // create object for student in db
    const student = new User({
      name,
      instructor: false,
      partyId,
    });
    if (!student) throw generateError('Couldn\'t create object for student in the database', RESPONSE_CODES.INTERNAL_ERROR);

    // find party servers, select one not yet at capacity to host student
    const partyServers = await Server.find({ partyId });
    if (!partyServers) throw generateError('Party not found', RESPONSE_CODES.NOT_FOUND);
    const partyServersWithRoom = partyServers.filter((server) => { return server.maxUsers - server.currUsers > 0; });
    if (!partyServersWithRoom || partyServersWithRoom.length === 0) throw generateError('Party is already full', RESPONSE_CODES.NOT_FOUND);
    const selectedServer = partyServersWithRoom[0];
    selectedServer.currUsers += 1;
    selectedServer.save();

    // add server address to student
    student.serverId = selectedServer.id;
    student.save();

    // respond with server address
    return { userId: student.id, address: selectedServer.address };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Deletes a student from the database, and decrements the number of users on the server that the
 * student was connected to
 * @param studentId - the ID of the student who is leaving the party
 * @returns A string indicating that the student has been disconnected from the party.
 */
const leavePartyAsStudent = async (studentId) => {
  try {
    // verify that call includes all parameters
    if (!studentId) throw generateError('Please specify student ID', RESPONSE_CODES.BAD_REQUEST);

    // find student, get its party code and server address
    const departingStudent = await User.findById(studentId);
    if (!departingStudent) throw generateError('Student not found', RESPONSE_CODES.NOT_FOUND);
    const { partyId, serverId } = departingStudent;

    // find server, remove student from it
    const server = await Server.findById(serverId);
    if (!server) throw generateError('Server not found', RESPONSE_CODES.NOT_FOUND);
    server.currUsers -= 1;
    server.save();

    // delete student object in db
    await User.findByIdAndDelete(studentId);

    // respond with message indicating successful disconnection
    return `Student ${studentId} disconnected successfully from party ${partyId}`;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Takes a party code, finds the party, and returns an array of all the party member objects
 * @param partyId - the party code of the party you want to get the members of
 * @returns array with all party members
 */
const getAllPartyMembers = async (partyId) => {
  try {
    // verify that call includes all parameters
    if (!partyId) throw generateError('Please specify a party code', RESPONSE_CODES.BAD_REQUEST);

    // find all users subscribed to party
    const partyMembers = User.find({ partyId });
    if (!partyMembers) throw generateError('Party not found', RESPONSE_CODES.NOT_FOUND);

    // respond with array of members
    return partyMembers;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Takes a party ID and an attribute, finds the party, and returns the attribute
 * @param partyId - the ID of the party you want to get the attribute of
 * @param attribute - the attribute of the party you want to get
 * @returns The party's attribute
 */
const getPartyInfo = async (partyId) => {
  try {
    // verify that call includes all parameters
    if (!partyId) throw generateError('Please specify a party ID', RESPONSE_CODES.BAD_REQUEST);

    // find party
    const party = await Party.findById(partyId);
    if (!party) throw generateError('Party not found', RESPONSE_CODES.NOT_FOUND);

    // respond with party attribute
    return party;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Takes a party ID and an attribute, finds the party, and updates the party's attribute with
 * the new value
 * @param partyId - the ID of the party to update
 * @param attribute - the attribute of the party to update
 * @param value - the value to set the attribute to
 * @returns A boolean for success
 */
const setPartyAttribute = async (partyId, attribute, value) => {
  try {
    // verify that call includes all parameters
    if (!partyId) throw generateError('Please specify a party ID', RESPONSE_CODES.BAD_REQUEST);

    // find party
    const party = await Party.findById(partyId);
    if (!party) throw generateError('Party not found', RESPONSE_CODES.NOT_FOUND);

    // update party attribute
    party[attribute] = value;
    await party.save();

    // respond with boolean for success
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getServerAddress = async (serverId) => {
  try {
    // verify that call includes all parameters
    if (!serverId) throw generateError('Please specify a server ID', RESPONSE_CODES.BAD_REQUEST);

    // find server
    const server = await Server.findById(serverId);
    if (!server) throw generateError('Server not found', RESPONSE_CODES.NOT_FOUND);

    // respond with server address
    return server.address;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const party = {
  createParty, joinPartyAsStudent, leavePartyAsStudent, getAllPartyMembers, getPartyInfo, setPartyAttribute, getServerAddress,
};

export default party;
