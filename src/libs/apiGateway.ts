import { AGWInput } from 'src/types';

export const formatJSONResponse = ({
  statusCode = 200,
  data = {},
  headers,
}: AGWInput) => {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers,
    },
  };
};
