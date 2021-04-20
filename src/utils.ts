import { ReceiverEvent } from "@slack/bolt";
import { ISlackPrivateReply, ISlackReactionReply, ISlackReply } from "./constants";

export function parseRequestBody(stringBody: string | null, contentType: string | undefined): any | undefined {
    try {
        if (!stringBody) {
            return "";
        }

        let result: any = {};

        if (contentType && contentType === "application/json") {
            return JSON.parse(stringBody);
        }

        let keyValuePairs: string[] = stringBody.split("&");
        keyValuePairs.forEach(function (pair: string): void {
            let individualKeyValuePair: string[] = pair.split("=");
            result[individualKeyValuePair[0]] = decodeURIComponent(individualKeyValuePair[1] || "");
        });
        return JSON.parse(JSON.stringify(result));

    } catch {
        return "";
    }
}

export function generateReceiverEvent(payload: any): ReceiverEvent {
    return {
        body: payload,
        ack: async (response): Promise<any> => {
            return {
              statusCode: 200,
              body: response ?? ""
            };
        }
    };
}

export function isUrlVerificationRequest(payload: any): boolean {
    if (payload && payload.type && payload.type === "url_verification") {
        return true;
    }
    return false;
}

export async function replyMessage(messagePacket: ISlackReply): Promise<void> {
    try {
        await messagePacket.app.client.chat.postMessage({
            token: messagePacket.botToken,
            channel: messagePacket.channelId,
            thread_ts: messagePacket.threadTimestamp,
            text: messagePacket.message
        });
    } catch (error) {
        console.error(error);
    }
}

export async function replyReaction(reactionPacket: ISlackReactionReply): Promise<void> {
    try {
        await reactionPacket.app.client.reactions.add({
            token: reactionPacket.botToken,
            name: reactionPacket.reaction,
            channel: reactionPacket.channelId,
            timestamp: reactionPacket.threadTimestamp,
        });
    } catch (error) {
        console.error(error);
    }
}

export async function replyPrivateMessage(messagePacket: ISlackPrivateReply): Promise<void> {
    try {
        await messagePacket.app.client.chat.postEphemeral({
            token: messagePacket.botToken,
            channel: messagePacket.channelId,
            text: messagePacket.message,
            user: messagePacket.userId
        });
    } catch (error) {
        console.error(error);
    }
}