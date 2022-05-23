const axios = require('axios');

const name = 'TestInstructor1';
const game = 'TestGame';
const numPlayers = 3;
let partyCode;

(async () => {
  try {
    // Attempt to create party; EXPECT: an _id
    const partyResponse = await axios.post('http://localhost:9090/server/createParty', { params: { name, game, numPlayers } });
    if (partyResponse.data.status === 200) {
      partyCode = partyResponse.data.data;
      console.log(`SUCCESS! Party created with code ${partyCode}`);
    } else {
      throw new Error('ERROR! Couldn\'t create party');
    }

    // Attempt to add Student1 to party; EXPECT: IP address 100.100.100.100
    const student1Response = await axios.post('http://localhost:9090/server/joinPartyAsStudent', { params: { name: 'Student1', partyCode } });
    if (student1Response.data.status === 200) console.log(`SUCCESS! Student1 added to server ${student1Response.data.data}`);
    else throw new Error('ERROR! Couldn\'t add Student1 to party');

    // Attempt to add Student2 to party; EXPECT: IP address 100.100.100.100
    const student2Response = await axios.post('http://localhost:9090/server/joinPartyAsStudent', { params: { name: 'Student2', partyCode } });
    if (student2Response.data.status === 200) console.log(`SUCCESS! Student2 added to server ${student2Response.data.data}`);
    else throw new Error('ERROR! Couldn\'t add Student1 to party');

    // Attempt to add Student3 to party; EXPECT: IP address 200.200.200.200
    const student3Response = await axios.post('http://localhost:9090/server/joinPartyAsStudent', { params: { name: 'Student3', partyCode } });
    if (student3Response.data.status === 200) console.log(`SUCCESS! Student3 added to server ${student3Response.data.data}`);
    else throw new Error('ERROR! Couldn\'t add Student1 to party');

    // Attempt to add Student4 to party; EXPECT: IP address 200.200.200.200
    const student4Response = await axios.post('http://localhost:9090/server/joinPartyAsStudent', { params: { name: 'Student4', partyCode } });
    if (student4Response.data.status === 200) console.log(`SUCCESS! Student4 added to server ${student4Response.data.data}`);
    else throw new Error('ERROR! Couldn\'t add Student1 to party');

    // Attempt to add Student5 to party; EXPECT: Error 404, 'Party is already full'
    const student5Response = await axios.post('http://localhost:9090/server/joinPartyAsStudent', { params: { name: 'Student5', partyCode } });
    if (student5Response.data.status === 404) console.log('SUCCESS! Couldn\'t add Student5 since the party is already full');
    else throw new Error('ERROR! Somehow, the student got added to a full party');
  } catch (error) {
    console.log(error);
  }
})();
