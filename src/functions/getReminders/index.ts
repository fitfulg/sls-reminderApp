import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { dynamo } from '@libs/dynamo';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.reminderTable;

    const { userId } = event.pathParameters || {};

    if (!userId) {
      return formatJSONResponse({
        statusCode: 400,
        data: {
          message: 'userId is required in path',
        },
      });
    }
    const data = await dynamo.query({
      tableName,
      index: 'index1',
      pkValue: userId,
    });

    return formatJSONResponse({
      data,
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
