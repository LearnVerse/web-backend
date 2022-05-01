import RESPONSE_CODES from './response-codes.json';
import RESPONSE_TYPES from './response-types.json';

/**
 * @param {String} responseType type of response to send
 * @param {Object} payload data or error info to send
 * @returns {Object} standardized object to send to client
 */
export const generateResponse = (responseType, payload) => {
  const responseInfo = RESPONSE_CODES[responseType];

  const { status, type } = responseInfo;

  return {
    status,
    type,
    ...(status === RESPONSE_CODES.SUCCESS.status ? { data: payload } : { error: payload }),
  };
};

/**
 * Takes a message and an error code, creates a new error with the message, and sets the code property of
 * the error to the code argument
 * @param message - The error message.
 * @param code - The HTTP status code for the error.
 * @returns error ready to be thrown
 */
export const generateError = (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

export {
  RESPONSE_CODES,
  RESPONSE_TYPES,
};

export const NO_PARTY_CODE = '0000';

export const GAME_PLAYER_LIMITS = {
  Dino: 20,
  Space: 4,
};
