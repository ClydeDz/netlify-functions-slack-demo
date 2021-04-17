import { APIGatewayEvent, Context } from 'aws-lambda'
import * as dotenv from 'dotenv'
dotenv.config();

export async function handler(event: APIGatewayEvent, context: Context) {
  return {
    statusCode: 200,
    body: "Hello, World"
  };
}