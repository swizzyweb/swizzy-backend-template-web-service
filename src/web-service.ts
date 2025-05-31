import {
  IWebServiceProps,
  RequestIdMiddleware,
  RequestLoggerMiddleware,
  SwizzyRequestMiddleware,
  WebService,
} from "@swizzyweb/swizzy-web-service";
import { FunnyWebRouter } from "./routers/FunnyRouter/funny-router";
import { IFunnyJokeClient } from "./client";
import { IWeatherClient } from "./client/weather-client";
import { ForecastWebRouter } from "./routers/ForecastRouter/forecast-router";
import { StatisticsWebRouter } from "./routers/StatisticsRouter/statistics-router";
import { MessageWebRouter } from "./routers/MessageRouter/message-router";

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
