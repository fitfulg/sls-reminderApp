import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { v4 as uuid } from 'uuid';
import { dynamo } from '@libs/dynamo';
import { validateInputs } from '@functions/utils';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const tableName = process.env.reminderTable;
    const { email, phoneNumber, reminder, reminderDate } = body;

    const validationErrors = validateInputs({
      email,
      phoneNumber,
      reminder,
      reminderDate,
    });
    if (validationErrors) return validationErrors;

    const userId = email || phoneNumber;

    const data = {
      ...body,
      id: uuid(),
      TTL: reminderDate / 1000,
      pk: userId,
      sk: reminderDate.toString(),
    };
    await dynamo.write(data, tableName);
    return formatJSONResponse({
      data: {
        message: `Reminder is set for ${reminder} on ${new Date(
          reminderDate,
        ).toDateString()}, you will be notified via ${email ? 'email' : 'sms'}`,
        id: data.id,
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
