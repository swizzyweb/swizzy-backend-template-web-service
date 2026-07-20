import { describe, it, before } from "node:test";
import { request, assertOk, assertBody, assertError, assertStatus } from "@swizzyweb/swizzy-web-service-test-framework";
import { createBackendTestApp } from "../../../helpers/create-backend-test-app.js";

describe("GetMessageController", () => {
  let app: any;

  before(async () => {
    const store = new Map<string, string>([["known-id", "hello from store"]]);
    ({ app } = await createBackendTestApp({ messageStore: store }));
  });

  it("GET /api/message/get returns 200 with message when id exists", async () => {
    const res = await request(app).get("/api/message/get").query({ messageId: "known-id" });
    assertOk(res);
    assertBody(res, { message: "hello from store" });
  });

  it("GET /api/message/get returns 404 when id is not found", async () => {
    const res = await request(app).get("/api/message/get").query({ messageId: "missing-id" });
    assertStatus(res, 404);
  });

  it("GET /api/message/get returns 400 when messageId is missing", async () => {
    const res = await request(app).get("/api/message/get");
    assertError(res, 400, "Invalid request");
  });
});
