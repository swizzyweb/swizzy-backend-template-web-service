import { describe, it, before } from "node:test";
import { request, assertOk, assertError } from "@swizzyai/swizzy-web-service-test-framework";
import { createSwizzyBackendTemplateTestApp } from "../../../helpers/create-swizzy-backend-template-test-app.js";

describe("WorldController", () => {
  let app: any;

  before(async () => {
    ({ app } = await createSwizzyBackendTemplateTestApp());
  });

  it("GET /api/hello/world returns 200", async () => {
    const res = await request(app)
      .get("/api/hello/world")
      .query({
        name: "test",
      });
    assertOk(res);
  });

  it("GET /api/hello/world returns 400 when query params are missing", async () => {
    const res = await request(app).get("/api/hello/world");
    assertError(res, 400);
  });

  it("GET /api/hello/world returns 400 when name is missing", async () => {
    const res = await request(app)
      .get("/api/hello/world")
      .query({});
    assertError(res, 400);
  });

  // This controller has no injectable dependency to fail, so there's nothing
  // to exercise the 500 path with yet. Once a real dependency is added to
  // WorldControllerState, mock it to throw and assert a 500 here.
  it.todo("returns 500 when an error occurs");
});
