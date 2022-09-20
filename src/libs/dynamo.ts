import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DBQuery } from '../types';
import {
  GetCommandInput,
  PutCommand,
  GetCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({});

export const dynamo = {
  write: async (data: Record<string, any>, tableName: string) => {
    const params: PutCommandInput = {
      TableName: tableName,
      Item: data,
    };
    const command = new PutCommand(params);
    await dynamoClient.send(command);

    return data;
  },
  get: async (id: string, tableName: string) => {
    const params: GetCommandInput = {
      TableName: tableName,
      Key: {
        id,
      },
    };
    const command = new GetCommand(params);
    const response = await dynamoClient.send(command);

    return response.Item;
  },
  query: async ({
    tableName,
    index,

    pkValue,
    pkKey = 'pk',

    skValue,
    skKey = 'sk',

    sortAscending = true,
  }: DBQuery) => {
    const skExpression = skValue ? ` AND ${skKey} = rangeValue` : '';
    const params: QueryCommandInput = {
      TableName: tableName,
      IndexName: index,
      KeyConditionExpression: `${pkKey} = :hashValue${skExpression}`,
      ExpressionAttributeValues: {
        ':hashValue': pkValue,
      },
    };
    if (skValue) {
      params.ExpressionAttributeValues[':rangeValue'] = skValue; //this is going to add the rangeValue to the params
    }
    const command = new QueryCommand(params);
    const res = await dynamoClient.send(command);

    return res.Items;
  },
};
