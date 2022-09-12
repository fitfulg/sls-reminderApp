import { DynamoDBStreamEvent } from 'aws-lambda';

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
    event.Records.forEach((record) => {
      const data = record.dynamodb.OldImage;
    });
  } catch (error) {
    console.log(error);
  }
};
