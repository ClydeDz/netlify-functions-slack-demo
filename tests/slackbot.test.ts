import { APIGatewayEvent, Context } from "aws-lambda";
import { assert } from "chai";
import { IHandlerResponse } from "../src/constants";
import { handler } from "../src/functions/slackbot";

describe("handler", (): void => {
    it("returns challenge when post is of type url_verification", async(): Promise<void> => {
        let request: APIGatewayEvent = {
            body: "{\"type\":\"url_verification\",\"challenge\":\"TEAM123\"}",
            headers: {
                "content-type": "application/json"
            },
            multiValueHeaders: null,
            httpMethod:null,
            isBase64Encoded:true,
            multiValueQueryStringParameters: null,
            path: null,
            pathParameters:null,
            queryStringParameters: null,
            requestContext: null,
            resource: null,
            stageVariables: null
        };
        let context: Context = null;
        let actualResponse: IHandlerResponse = null;

        await Promise.resolve(handler(request, context).then((promiseReturnValue: any) => {
            let promiseResponse: IHandlerResponse = JSON.parse(JSON.stringify(promiseReturnValue));
            actualResponse = {...promiseResponse};
        }));
        assert.strictEqual(actualResponse.body, "TEAM123");
    });

    it("returns 200 status code when valid event payload is passed", async(): Promise<void> => {
        let request: APIGatewayEvent = {
            body: `{"token":"TOKEN123","team_id":"TEAM123","api_app_id":"APPID123","event":
                {"bot_id":"BOTID","bot_profile":{"id":"BOTPROFLEID"}}}`,
            headers: {
                "content-type": "application/json"
            },
            multiValueHeaders: null,
            httpMethod:null,
            isBase64Encoded:true,
            multiValueQueryStringParameters: null,
            path: null,
            pathParameters:null,
            queryStringParameters: null,
            requestContext: null,
            resource: null,
            stageVariables: null
        };
        let context: Context = null;
        let actualResponse: IHandlerResponse = null;

        await Promise.resolve(handler(request, context).then((promiseReturnValue: any) => {
            let promiseResponse: IHandlerResponse = JSON.parse(JSON.stringify(promiseReturnValue));
            actualResponse = {...promiseResponse};
        }));

        assert.strictEqual(actualResponse.body, "");
    });
});