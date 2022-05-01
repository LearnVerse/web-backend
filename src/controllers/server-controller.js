import Server from '../models/server-model';
import User from '../models/user-model';
import Party from '../models/party-model';
import {
  generateError, RESPONSE_CODES, NO_PARTY_CODE, GAME_PLAYER_LIMITS,
} from '../constants';

/**
 * Create party and instructor objects in the database, assign them to each other, and allocate servers for the party
 * @param name {string} - the name of the instructor
 * @param game {string} - the game the party is playing
 * @param numPlayers {number} - the number of players in the party, must be an integer
 * @returns _id of party object in db
 */
const createParty = async (name, game, numPlayers) => {
  try {
    // create object for instructor in db
    const instructor = new User({
      name,
      instructor: true,
      partyCode: '',
      address: '',
      allPartyAddresses: [],
    });
    if (!instructor) { throw generateError('Couldn\'t create object for instructor', RESPONSE_CODES.NOT_FOUND); }
    instructor.save();

    // create object for party in db, assign instructor
    const party = new Party({
      instructor: instructor._id,
      students: [],
    });
    if (!party) { throw generateError('Couldn\'t create object for party', RESPONSE_CODES.NOT_FOUND); }
    party.save();

    // find available servers in db
    const numServersNeeded = Math.ceil(numPlayers / GAME_PLAYER_LIMITS[game]);
    const availableServers = await Server.find({ game, partyCode: NO_PARTY_CODE });
    if (!availableServers) { throw generateError('Couldn\'t find servers for party', RESPONSE_CODES.NOT_FOUND); }

    // allocate sufficient servers or warn if unable
    if (availableServers.length < numServersNeeded) { throw generateError('Not enough servers currently available for this party', RESPONSE_CODES.NOT_FOUND); }
    const partyServers = availableServers.slice(0, numServersNeeded);

    // set partyCode and instructor in each of the selected servers
    // + store server addresses in instructor and party
    partyServers.forEach((server) => {
      server.partyCode = party._id;
      server.instructor = instructor._id;
      server.save();
      instructor.allPartyAddresses.push(server.address);
      party.addresses.push(server.address);
    });
    instructor.save();
    party.save();

    // respond with id for party object in db
    return party._id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Create a student object in the database, assign it to a server, and add the student to the party
 * @param name {string} - the name of the student
 * @param partyCode {string} - the party code that the student is trying to join
 * @returns address of server student was assigned to
 */
const joinPartyAsStudent = async (name, partyCode) => {
  try {
    // create object for student in db
    const student = new User({
      name,
      instructor: false,
      partyCode,
      address: '',
      allPartyAddresses: [],
    });
    if (!student) { throw generateError('Couldn\'t create object for student', RESPONSE_CODES.NOT_FOUND); }

    // find party servers, assign student to one of them
    const partyServers = await Server.find({ partyCode });
    if (!partyServers) { throw generateError('Party not found', RESPONSE_CODES.NOT_FOUND); }
    const partyServersWithRoom = partyServers.filter((server) => { return server.maxUsers - server.currUsers > 0; });
    if (!partyServersWithRoom || partyServersWithRoom.length === 0) { throw generateError('Party is already full', RESPONSE_CODES.NOT_FOUND); }
    const selectedServer = partyServersWithRoom[0];
    selectedServer.currUsers += 1;
    selectedServer.students.push(student._id);
    selectedServer.save();

    // add server address to student
    student.address = selectedServer.address;
    student.save();

    // get party object from db and add student to it
    const party = await Party.findOne({ _id: partyCode });
    party.students.push(student._id);
    party.save();

    // respond with server address
    return selectedServer.address;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const server = { createParty, joinPartyAsStudent };

export default server;
