import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { v4 as uuid } from 'uuid';
import { dynamo } from '@libs/dynamo';

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

const validateInputs = ({
  email,
  phoneNumber,
  reminder,
  reminderDate,
}: {
  email?: string;
  phoneNumber?: string;
  reminder: string;
  reminderDate: number;
}) => {
  if (!email && !phoneNumber) {
    return formatJSONResponse({
      statusCode: 400,
      data: {
        message: 'Email or phone number is required',
      },
    });
  }
  if (!reminder) {
    return formatJSONResponse({
      statusCode: 400,
      data: {
        message: 'Reminder required to create a reminder',
      },
    });
  }
  if (!reminderDate) {
    return formatJSONResponse({
      statusCode: 400,
      data: {
        message: 'ReminderDate required to create a reminder',
      },
    });
  }

  return;
};
