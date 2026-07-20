import { describe, it, before } from "node:test";
import { request, assertOk, assertBody, assertError } from "@swizzyweb/swizzy-web-service-test-framework";
import { createBackendTestApp, testJoke } from "../../../helpers/create-backend-test-app.js";

describe("FunnyJokeController", () => {
  let app: any;

  before(async () => {
    ({ app } = await createBackendTestApp());
  });

  it("GET /api/funny/joke returns 200 with joke and message", async () => {
    const res = await request(app).get("/api/funny/joke");
    assertOk(res);
    assertBody(res, { message: "Here's your funny joke", joke: testJoke });
  });

  it("GET /api/funny/joke returns 500 when client throws", async () => {
    const { app: errorApp } = await createBackendTestApp({
      funnyJokeClient: { getFunnyJoke: async () => { throw new Error("upstream down"); } },
    });
    const res = await request(errorApp).get("/api/funny/joke");
    assertError(res, 500, "Internal error occurred");
  });
});
