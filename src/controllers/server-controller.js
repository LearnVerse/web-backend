import Server from '../models/server-model';
import { RESPONSE_CODES } from '../constants';

const getServers = async () => {
  try {
    const servers = await Server.find();
    if (servers) return servers;
    const error = new Error('Not found');
    error.code = RESPONSE_CODES.NOT_FOUND;
    throw error;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default getServers;
