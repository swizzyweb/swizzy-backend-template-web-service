import { createTestApp, mock, mockState } from "@swizzyweb/swizzy-web-service-test-framework";
import { SampleBackendWebService, SampleBackendWebServiceState } from "../../src/web-service.js";
import type { IFunnyJokeClient } from "../../src/client/index.js";
import type { IWeatherClient } from "../../src/client/weather-client.js";

export const testJoke = {
  id: 1,
  setup: "Why did the developer go broke?",
  punchline: "Because he used up all his cache.",
  type: "programming",
};

export const testForecast = {
  hourly: {
    time: ["2024-01-01T00:00"],
    temperature_2m: [22.5],
  },
};

export function defaultTestState(
  overrides: Partial<SampleBackendWebServiceState> = {},
): SampleBackendWebServiceState {
  const base: SampleBackendWebServiceState = {
    funnyJokeClient: mock<IFunnyJokeClient>({
      getFunnyJoke: async () => testJoke,
    }),
    weatherClient: mock<IWeatherClient>({
      getHourly: async () => testForecast,
    }),
    serverStartTime: 1000,
    messageStore: new Map<string, string>(),
  };
  return mockState(base, overrides);
}

export async function createBackendTestApp(
  overrides: Partial<SampleBackendWebServiceState> = {},
) {
  return createTestApp(
    (app, logger) =>
      new SampleBackendWebService({
        port: 0,
        app,
        logger,
        state: defaultTestState(overrides),
      }),
  );
}
