import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { request, assertOk, assertBody } from "@swizzyweb/swizzy-web-service-test-framework";
import { createBackendTestApp } from "../../../helpers/create-backend-test-app.js";

describe("UpTimeController", () => {
  let app: any;
  const fixedStartTime = 1000;

  before(async () => {
    ({ app } = await createBackendTestApp({ serverStartTime: fixedStartTime }));
  });

  it("GET /api/stats/uptime returns 200 with upSince and upTime", async () => {
    const res = await request(app).get("/api/stats/uptime");
    assertOk(res);
    assert.equal(res.body.upSince.epoch, fixedStartTime, "upSince.epoch should match serverStartTime");
    assert.ok(typeof res.body.upSince.date === "string", "upSince.date should be an ISO string");
    assert.ok(typeof res.body.upTime === "number", "upTime should be a number");
    assert.ok(res.body.upTime >= 0, "upTime should be non-negative");
    assert.ok(typeof res.body.now === "number", "now should be a number");
  });
});
