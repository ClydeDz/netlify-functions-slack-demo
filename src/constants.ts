import { App } from "@slack/bolt";

export enum SlashCommands {
    GREET = "/greet"
}

export enum DefaultBotSettings {
    REACTION = ":robot_face:",
    MESSAGE = "Hello!"
}

interface IBaseSlackReply {
    app: App;
    botToken: string | undefined;
    channelId: string;
    threadTimestamp: string;
}

export interface ISlackReactionReply extends IBaseSlackReply {
    reaction: string;
}

export interface ISlackReply extends IBaseSlackReply {
    message: string;
}

export interface ISlackPrivateReply extends Omit<ISlackReply, "threadTimestamp"> {
    userId: string;
}

export interface IHandlerResponse {
    statusCode: number;
    body: string;
}