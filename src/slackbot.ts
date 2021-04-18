import { App, ExpressReceiver, ReceiverEvent } from '@slack/bolt'
import { APIGatewayEvent, Context } from 'aws-lambda'
import * as dotenv from 'dotenv'
dotenv.config();

const expressReceiver = new ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  processBeforeResponse: true
});

const app = new App({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  token: `${process.env.SLACK_BOT_TOKEN}`,
  receiver: expressReceiver
});

async function replyMessage(channelId: string, messageThreadTs: string): Promise<void> {
  try {
    await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channelId,
      thread_ts: messageThreadTs,
      text: "Hello :wave:"
    });
  } catch (error) {
    console.error(error);
  }
}

async function replyReaction(channelId: string, messageThreadTs: string) {
  try {
      await app.client.reactions.add({
          token: process.env.SLACK_BOT_TOKEN,
          name: 'robot_face',
          channel: channelId,
          timestamp: messageThreadTs,
      });
  } catch (error) {
      console.error(error);
  }
}

app.message(async ({ message }) => {
  await replyReaction(message.channel, message.ts);
  await replyMessage(message.channel, message.ts);
});

app.command('/greet', async({body, ack}) => {
  ack();
  await app.client.chat.postEphemeral({
      token: process.env.SLACK_BOT_TOKEN,
      channel: body.channel_id,
      text: "Greetings, user!" ,
      user: body.user_id
  });
});

function parseRequestBody(stringBody: string | null, contentType: string | undefined) {
  try {
    let inputStringBody: string = stringBody ?? "";
    let result: any = {};

    if(contentType && contentType === 'application/x-www-form-urlencoded') {
      var keyValuePairs = inputStringBody.split('&');
      keyValuePairs.forEach(function(pair: string): void {
          let individualKeyValuePair: string[] = pair.split('=');
          result[individualKeyValuePair[0]] = decodeURIComponent(individualKeyValuePair[1] || '');
      });
      return JSON.parse(JSON.stringify(result));
    } else {
      return JSON.parse(inputStringBody);
    }
  } catch {
    return undefined;
  }
}

export async function handler(event: APIGatewayEvent, context: Context) {
  const payload = parseRequestBody(event.body, event.headers["content-type"]);

  if(payload && payload.type && payload.type === 'url_verification') {
    return {
      statusCode: 200,
      body: payload.challenge
    };
  }

  const slackEvent: ReceiverEvent = {
    body: payload,
    ack: async (response) => {
      return new Promise<void>((resolve, reject) => {
        resolve();
        return {
          statusCode: 200,
          body: response ?? ""
        };
      });
    },
  };

  await app.processEvent(slackEvent);

  return {
    statusCode: 200,
    body: ""
  };
}