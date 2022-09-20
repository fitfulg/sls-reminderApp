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
import { Inputs } from 'src/types';

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
}: Inputs) => {
  const cases = [
    {
      condition: !email && !phoneNumber,
      message: 'You must provide either an email or a phone number',
    },
    {
      condition: !reminderDate,
      message: 'Reminder date required to create a reminder',
    },
    {
      condition: !reminder,
      message: 'You must provide a reminder',
    },
  ];
  const messages = cases
    .filter((caseItem) => caseItem.condition)
    .map((caseItem) => caseItem.message);
  if (messages.length) {
    return formatJSONResponse({
      statusCode: 400,
      data: {
        message: messages.join(),
      },
    });
  }
};
