import { DynamoDBStreamEvent } from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { sendEmail, sendSMS } from '@functions/utils';

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
    const reminderPromises = event.Records.map(async (record) => {
      const data = unmarshall(
        record.dynamodb.OldImage as Record<string, AttributeValue>,
      );

      const { email, phoneNumber, reminder } = data;
      if (phoneNumber) {
        await sendSMS({ phoneNumber, reminder });
      }
      if (email) {
        await sendEmail({ email, reminder });
      }
    });
    await Promise.all(reminderPromises);
  } catch (error) {
    console.log(error);
  }
};
