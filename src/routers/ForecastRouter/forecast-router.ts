import {
  IWebRouterProps,
  RequestIdMiddleware,
  RequestLoggerMiddleware,
  StateConverter,
  StateConverterProps,
  SwizzyRequestMiddleware,
  WebRouter,
} from "@swizzyweb/swizzy-web-service";
import { SampleBackendWebServiceState } from "../../web-service";
import path from "path";
// @ts-ignore
import express from "@swizzyweb/express";
import { IFunnyJokeClient, IWeatherClient } from "../../client";
import { HourlyForecastController } from "./controllers/hourly-forecast-controller";
export interface ForecastRouterState {
  weatherClient: IWeatherClient;
}

export interface ForecastRouterProps
  extends IWebRouterProps<SampleBackendWebServiceState, ForecastRouterState> {}
export class ForecastWebRouter extends WebRouter<
  SampleBackendWebServiceState,
  ForecastRouterState
> {
  constructor(props: ForecastRouterProps) {
    super({
      ...props,
      name: "ForecastWebRouter",
      path: "forecast",
      stateConverter: ForecastRouterStateConverter,
      webControllerClasses: [HourlyForecastController],
      middleware: [
        SwizzyRequestMiddleware,
        RequestIdMiddleware,
        RequestLoggerMiddleware,
      ],
    });
  }
}

const ForecastRouterStateConverter: StateConverter<
  SampleBackendWebServiceState,
  ForecastRouterState
> = async function (
  props: StateConverterProps<SampleBackendWebServiceState>,
): Promise<ForecastRouterState> {
  return { ...props.state };
};
