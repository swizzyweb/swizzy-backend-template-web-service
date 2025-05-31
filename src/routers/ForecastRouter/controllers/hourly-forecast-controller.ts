import {
  DefaultStateExporter,
  IWebControllerInitProps,
  IWebControllerProps,
  RequestMethod,
  SwizzyMiddleware,
  SwizzyMiddlewareProps,
  WebController,
  WebControllerFunction,
} from "@swizzyweb/swizzy-web-service";
import { ForecastRouterState } from "../forecast-router";
// @ts-ignore
import { Request, Response, NextFunction, json } from "@swizzyweb/express";
import { IWeatherClient } from "../../../client";

export interface HourlyForecastControllerState {
  weatherClient: IWeatherClient;
}

export interface HourlyForecastControllerProps
  extends IWebControllerProps<
    ForecastRouterState,
    HourlyForecastControllerState
  > {}

export const HourlyForecaseValidationMiddleware: SwizzyMiddleware<HourlyForecastControllerState> =
  function (props: SwizzyMiddlewareProps<HourlyForecastControllerState>) {
    return function (req: Request, res: Response, next: NextFunction) {
      const { longitude, latitude } = req.body;
      if (!longitude || !latitude) {
        res.status(400);
        res.json({ message: `Invalid request` });
        return;
      }
      if (typeof longitude !== "number" || typeof latitude !== "number") {
        res.status(400);
        res.json({ message: `Invalid request` });
        return;
      }
      next();
    };
  };

type HourlyForecastRequest = Request & {
  body: {
    latitude: string;
    longitude: string;
  };
};

export class HourlyForecastController extends WebController<
  ForecastRouterState,
  HourlyForecastControllerState
> {
  constructor(props: HourlyForecastControllerProps) {
    super({
      ...props,
      name: "HourlyForecastController",
      action: "hourly",
      method: RequestMethod.post,
      stateConverter: DefaultStateExporter,
      middleware: [json, HourlyForecaseValidationMiddleware],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<ForecastRouterState> & {
      state: HourlyForecastControllerState | undefined;
    },
  ): Promise<WebControllerFunction> {
    const logger = this.logger;
    const getState = this.getState.bind(this);
    return async function (req: HourlyForecastRequest, res: Response) {
      try {
        const { weatherClient } = getState()!;
        const { latitude, longitude } = req.body;
        const forecast = await weatherClient.getHourly({
          latitude,
          longitude,
        });
        res.json({
          forecast,
        });
        return;
      } catch (e: any) {
        logger.error(e);
        res.status(500);
        res.json({ message: "Internal error occurred" });
      }
    };
  }
}
