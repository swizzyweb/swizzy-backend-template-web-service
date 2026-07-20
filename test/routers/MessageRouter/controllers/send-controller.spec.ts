import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { request, assertOk, assertBody, assertError } from "@swizzyweb/swizzy-web-service-test-framework";
import { createBackendTestApp } from "../../../helpers/create-backend-test-app.js";

describe("SendMessageController", () => {
  let app: any;

  before(async () => {
    ({ app } = await createBackendTestApp());
  });

  it("PUT /api/message/send returns 200 with info and messageId", async () => {
    const res = await request(app)
      .put("/api/message/send")
      .send({ message: "hello world" });
    assertOk(res);
    assertBody(res, { info: "Message sent" });
    assert.ok(typeof res.body.messageId === "string", "messageId should be a string");
    assert.ok(res.body.messageId.length > 0, "messageId should not be empty");
  });

  it("PUT /api/message/send returns 400 when message is missing", async () => {
    const res = await request(app).put("/api/message/send").send({});
    assertError(res, 400, "Invalid request");
  });

  it("PUT /api/message/send returns 400 when message is not a string", async () => {
    const res = await request(app).put("/api/message/send").send({ message: 42 });
    assertError(res, 400, "Invalid request");
  });
});
