import {
  IWebServiceProps,
  RequestIdMiddleware,
  RequestLoggerMiddleware,
  SwizzyRequestMiddleware,
  WebService,
} from "@swizzyweb/swizzy-web-service";
import { FunnyWebRouter } from "./routers/FunnyRouter/funny-router.js";
import { IFunnyJokeClient } from "./client/index.js";
import { IWeatherClient } from "./client/weather-client.js";
import { ForecastWebRouter } from "./routers/ForecastRouter/forecast-router.js";
import { StatisticsWebRouter } from "./routers/StatisticsRouter/statistics-router.js";
import { MessageWebRouter } from "./routers/MessageRouter/message-router.js";

export interface SampleBackendWebServiceState {
  funnyJokeClient: IFunnyJokeClient;
  weatherClient: IWeatherClient;
  serverStartTime: number;
  messageStore: Map<string, string>;
}

export interface SampleBackendWebServiceProps
  extends IWebServiceProps<SampleBackendWebServiceState> {
  port: number;
  path?: string;
}

export class SampleBackendWebService extends WebService<SampleBackendWebServiceState> {
  constructor(props: SampleBackendWebServiceProps) {
    super({
      ...props,
      name: "SampleBackendWebService",
      path: props.path ?? "api",
      packageName: "@swizzyweb/swizzy-backend-template-web-service",
      routerClasses: [
        FunnyWebRouter,
        ForecastWebRouter,
        StatisticsWebRouter,
        MessageWebRouter,
      ],
      middleware: [],
    });
  }
}
