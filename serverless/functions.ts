import type { AWS } from '@serverless/typescript';

const functions: AWS['functions'] = {
  setReminder: {
    handler: 'src/functions/setReminder/index.handler',
    events: [
      {
        httpApi: {
          path: '/',
          method: 'post',
        },
      },
    ],
  },
  sendReminder: {
    handler: 'src/functions/sendReminder/index.handler',
    events: [
      {
        stream: {
          type: 'dynamodb',
          arn: {
            'Fn::GetAtt': ['reminderTable', 'StreamArn'],
          },
          filterPattern: [
            {
              // we only want to send reminders when a reminder is removed
              eventName: ['REMOVE'],
            },
          ],
        },
      },
    ],
  },
};

export default functions;