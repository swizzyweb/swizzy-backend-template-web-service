import { FunnyJokeClient } from "./client/index.js";
import { OpenMeteoWeatherClient } from "./client/weather-client.js";
import { SampleBackendWebService } from "./web-service.js";

export interface GetSampleFrontendWebserviceProps {
  serviceArgs: {
    funnyJokeBaseUrl?: string;
    openMeteoBaseUrl?: string;
  };
}
export async function getWebservice(
  props: GetSampleFrontendWebserviceProps & any,
) {
  const state = {
    funnyJokeClient: new FunnyJokeClient({
      baseUrl: props.serviceArgs.funnyJokeBaseUrl,
    }),
    weatherClient: new OpenMeteoWeatherClient({
      baseUrl: props.serviceArgs.openMeteoBaseUrl,
    }),
    serverStartTime: Date.now(),
    messageStore: new Map<string, string>(),
  };
  return new SampleBackendWebService({
    ...props,
    ...props.serviceArgs,
    state,
  });
}
