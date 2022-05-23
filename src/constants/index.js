export const RESPONSE_CODES = {
  SUCCESS: {
    status: 200,
    type: 'SUCCESS',
  },
  NOT_FOUND: {
    status: 404,
    type: 'NOT_FOUND',
  },
  INTERNAL_ERROR: {
    status: 500,
    type: 'INTERNAL_ERROR',
  },
  BAD_REQUEST: {
    status: 400,
    type: 'BAD_REQUEST',
  },
  UNAUTHORIZED: {
    status: 401,
    type: 'UNAUTHORIZED',
  },
  FORBIDDEN: {
    status: 403,
    type: 'FORBIDDEN',
  },
  NO_CONTENT: {
    status: 200,
    type: 'NOTHING TO UPDATE',
  },
};

export const RESPONSE_TYPES = {
  SUCCESS: 'SUCCESS',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NO_CONTENT: 'NO_CONTENT',
};

export const NO_PARTY_CODE = '0000';

export const GAME_PLAYER_LIMITS = {
  Evolution: 20,
  Gravity: 4,
  TestGame: 2,
};

/**
 * Takes a response type and a payload, and returns a response object with the status, type, and
 * data/error properties
 * @param responseType - The type of response you want to generate.
 * @param payload - The data that you want to send back to the client.
 * @returns An object with a status, type, data, and error property.
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

/**
 * Takes a response object and an error object, logs the error, and sends a response to the client
 * with the appropriate status code and message
 * @param res - The response object from the express route.
 * @param error - The error object that was thrown.
 */
export const handleError = (res, error) => {
  console.log(error);
  if (error.code) {
    res.status(error.code.status).send(
      generateResponse(error.code.type, error.message),
    );
  } else {
    res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
      generateResponse(RESPONSE_CODES.INTERNAL_ERROR.type, ''),
    );
  }
};
