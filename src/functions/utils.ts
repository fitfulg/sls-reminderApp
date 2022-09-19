import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from '@aws-sdk/client-sns';
import { formatJSONResponse } from '@libs/apiGateway';

const sesClient = new SESClient({});
const snsClient = new SNSClient({});

export const sendEmail = async ({
  email,
  reminder,
}: {
  email: string;
  reminder: string;
}) => {
  console.log(`Sending email to ${email} with reminder ${reminder}`);
  const params: SendEmailCommandInput = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: reminder,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Your Reminder',
      },
    },
    Source: process.env.VERIFIED_EMAIL,
  };
  const command = new SendEmailCommand(params);
  const res = await sesClient.send(command);
  return res.MessageId;
};

export const sendSMS = async ({
  phoneNumber,
  reminder,
}: {
  phoneNumber: string;
  reminder: string;
}) => {
  console.log(`Sending SMS to ${phoneNumber} with reminder ${reminder}`);
  const params: PublishCommandInput = {
    Message: reminder,
    PhoneNumber: phoneNumber,
  };
  const command = new PublishCommand(params);
  const res = await snsClient.send(command);
  return res.MessageId;
};

export const validateInputs = ({
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
// TODO: create interfase inputs and clean ifs
