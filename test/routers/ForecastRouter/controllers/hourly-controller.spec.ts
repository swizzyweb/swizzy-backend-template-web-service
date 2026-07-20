import { describe, it, before } from "node:test";
import { request, assertOk, assertBody, assertError, assertStatus } from "@swizzyweb/swizzy-web-service-test-framework";
import { createBackendTestApp, testForecast } from "../../../helpers/create-backend-test-app.js";

describe("HourlyForecastController", () => {
  let app: any;

  before(async () => {
    ({ app } = await createBackendTestApp());
  });

  it("POST /api/forecast/hourly returns 200 with forecast", async () => {
    const res = await request(app)
      .post("/api/forecast/hourly")
      .send({ latitude: 51.5, longitude: -0.1 });
    assertOk(res);
    assertBody(res, { forecast: testForecast });
  });

  it("POST /api/forecast/hourly returns 400 when body is missing", async () => {
    const res = await request(app).post("/api/forecast/hourly").send({});
    assertError(res, 400, "Invalid request");
  });

  it("POST /api/forecast/hourly returns 400 when coordinates are wrong type", async () => {
    const res = await request(app)
      .post("/api/forecast/hourly")
      .send({ latitude: "north", longitude: "west" });
    assertError(res, 400, "Invalid request");
  });

  it("POST /api/forecast/hourly returns 500 when client throws", async () => {
    const { app: errorApp } = await createBackendTestApp({
      weatherClient: { getHourly: async () => { throw new Error("weather api down"); } },
    });
    const res = await request(errorApp)
      .post("/api/forecast/hourly")
      .send({ latitude: 51.5, longitude: -0.1 });
    assertError(res, 500, "Internal error occurred");
  });
});
