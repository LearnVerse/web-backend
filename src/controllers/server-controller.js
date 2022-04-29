import Server from '../models/server-model';
import { RESPONSE_CODES } from '../constants';

const getServers = async () => {
  try {
    const servers = await Server.find();
    console.log(servers);
    if (servers) return servers;
    const error = new Error('Not found');
    error.code = RESPONSE_CODES.NOT_FOUND;
    throw error;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const server = { getServers };

export default server;
