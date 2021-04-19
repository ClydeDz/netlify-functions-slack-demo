import { assert } from "chai";
import { isUrlVerificationRequest, parseRequestBody, replyMessage, replyPrivateMessage, replyReaction } from "../src/utils";
import sinon from "sinon";
import { ISlackPrivateReply, ISlackReactionReply, ISlackReply } from "../src/constants";

describe("parseRequestBody", (): void => {
    it("returns empty string when empty string is passed", (): void => {
        let result: any = parseRequestBody("", "application/x-www-form-urlencoded");
        assert.isEmpty(result);
    });

    it("returns empty string when null value is passed", (): void => {
        let result: any = parseRequestBody(null, "application/x-www-form-urlencoded");
        assert.isEmpty(result);
    });

    it("returns empty string when a simple string is passed", (): void => {
        let result: any = parseRequestBody("abc123", "application/json");
        assert.isEmpty(result);
    });

    it("returns expected JSON result when url encoded value is passed", (): void => {
        let expectedJson: any = {
            token: "AbCD123",
            team_id: "T1234ABCD",
            team_domain: "demoapp"
        };
        let result: any = parseRequestBody("token=AbCD123&team_id=T1234ABCD&team_domain=demoapp", "application/x-www-form-urlencoded");
        assert.strictEqual(result.token, expectedJson.token);
        assert.strictEqual(result.team_domain, expectedJson.team_domain);
        assert.strictEqual(result.team_id, expectedJson.team_id);
    });

    // todo: fix this test by grabbing the right body
    // it("returns expected JSON result when url encoded value is passed", (): void => {
    //     let expectedJson = {
    //         token: "AbCD123",
    //         team_id: "T1234ABCD",
    //         team_domain: "demoapp"
    //     };
    //     let result = parseRequestBody("{\r\ntoken: \'AbCD123\',\r\nteam_id: \'T1234ABCD\',\r\nteam_domain: \'demoapp\'\r\n};",
    //         "application/json");
    //     expect(result.token).is.equal(expectedJson.token);
    //     expect(result.team_domain).is.equal(expectedJson.team_domain);
    //     expect(result.team_id).is.equal(expectedJson.team_id);
    // });
});

describe("isUrlVerificationRequest", (): void => {
    it("returns true when type is url_verification", (): void => {
        let payload: any = {
            type: "url_verification",
        };
        let result: boolean = isUrlVerificationRequest(payload);
        assert.isTrue(result);
    });

    it("returns false when type is some_other_event", (): void => {
        let payload: any = {
            type: "some_other_event",
        };
        let result: boolean = isUrlVerificationRequest(payload);
        assert.isFalse(result);
    });

    it("returns false when type is not passed", (): void => {
        let payload: any = {
            body: "demo",
            header: "slack",
        };
        let result: boolean = isUrlVerificationRequest(payload);
        assert.isFalse(result);
    });

    it("returns false when payload passed is null", (): void => {
        let payload: any = null;
        let result: boolean = isUrlVerificationRequest(payload);
        assert.isFalse(result);
    });

    it("returns false when payload passed is undefined", (): void => {
        let payload: any = undefined;
        let result: boolean = isUrlVerificationRequest(payload);
        assert.isFalse(result);
    });
});

describe("replyMessage", (): void => {
    it("returns false when payload passed is undefined", (): void => {
        const fakeApp: any = {
            client: {
                chat: {
                    postMessage: sinon.fake()
                }
            }
        };
        const messagePacket: ISlackReply = {
            app: fakeApp,
            botToken: "token",
            channelId: "channel",
            threadTimestamp: "thread",
            message: "Hello :wave:"
        };
        const expectedCalledWith: any = {
            token: messagePacket.botToken,
            channel: messagePacket.channelId,
            thread_ts: messagePacket.threadTimestamp,
            text: messagePacket.message
        };
        replyMessage(messagePacket);
        assert.isTrue(fakeApp.client.chat.postMessage.called);
        assert.isTrue(fakeApp.client.chat.postMessage.calledWith(expectedCalledWith));
    });
});

describe("replyReaction", (): void => {
    it("returns false when payload passed is undefined", (): void => {
        const fakeApp: any = {
            client: {
                reactions: {
                    add: sinon.fake()
                }
            }
        };
        const reactionPacket: ISlackReactionReply = {
            app: fakeApp,
            botToken: "token",
            channelId: "channel",
            threadTimestamp: "thread",
            reaction: ":wave:"
        };
        const expectedCalledWith: any = {
            token: reactionPacket.botToken,
            name: reactionPacket.reaction,
            channel: reactionPacket.channelId,
            timestamp: reactionPacket.threadTimestamp,
        };
        replyReaction(reactionPacket);
        assert.isTrue(fakeApp.client.reactions.add.called);
        assert.isTrue(fakeApp.client.reactions.add.calledWith(expectedCalledWith));
    });
});

describe("replyPrivateMessage", (): void => {
    it("returns false when payload passed is undefined", (): void => {
        const fakeApp: any = {
            client: {
                chat: {
                    postEphemeral: sinon.fake()
                }
            }
        };
        const privateMessagePacket: ISlackPrivateReply = {
            app: fakeApp,
            botToken: "token",
            channelId: "channel",
            message: "Greetings, user!",
            userId: "user-id"
        };
        const expectedCalledWith: any = {
            token: privateMessagePacket.botToken,
            channel: privateMessagePacket.channelId,
            text: privateMessagePacket.message,
            user: privateMessagePacket.userId
        };
        replyPrivateMessage(privateMessagePacket );
        assert.isTrue(fakeApp.client.chat.postEphemeral.called);
        assert.isTrue(fakeApp.client.chat.postEphemeral.calledWith(expectedCalledWith));
    });
});