import { describe, it, before } from "node:test";
import { request, assertOk, assertBody, assertError, assertStatus } from "@swizzyweb/swizzy-web-service-test-framework";
import { createBackendTestApp } from "../../../helpers/create-backend-test-app.js";

describe("DeleteMessageController", () => {
  let app: any;

  before(async () => {
    const store = new Map<string, string>([["del-id", "to be deleted"]]);
    ({ app } = await createBackendTestApp({ messageStore: store }));
  });

  it("DELETE /api/message/delete returns 200 and removes the message", async () => {
    const res = await request(app).del("/api/message/delete").query({ messageId: "del-id" });
    assertOk(res);
    assertBody(res, { info: "Success" });
  });

  it("DELETE /api/message/delete returns 404 when id is not found", async () => {
    const res = await request(app).del("/api/message/delete").query({ messageId: "ghost-id" });
    assertStatus(res, 404);
  });

  it("DELETE /api/message/delete returns 400 when messageId is missing", async () => {
    const res = await request(app).del("/api/message/delete");
    assertError(res, 400, "Invalid request");
  });
});
