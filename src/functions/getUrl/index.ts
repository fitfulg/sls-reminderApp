import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { dynamo } from '@libs/dynamo';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.urlTable;
    const { code } = event.pathParameters || {};
    if (!code) {
      return formatJSONResponse({
        statusCode: 400,
        data: {
          message: 'Code is required in path parameters',
        },
      });
    }
    const record = await dynamo.get(code, tableName);
    const originalUrl = record.originalUrl;

    return formatJSONResponse({
      data: {},
      statusCode: 301,
      headers: {
        Location: originalUrl,
      },
    });
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      statusCode: 502,
      data: {
        message: error.message,
      },
    });
  }
};
