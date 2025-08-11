import {
  IWebRouterProps,
  RequestIdMiddleware,
  RequestLoggerMiddleware,
  StateConverter,
  StateConverterProps,
  SwizzyRequestMiddleware,
  WebRouter,
} from "@swizzyweb/swizzy-web-service";
import { SampleBackendWebServiceState } from "../../web-service.js";
import { UpTimeController } from "./controllers/uptime-controller.js";
export interface StatisticsRouterState {
  serverStartTime: number;
}

export interface StatisticsRouterProps
  extends IWebRouterProps<
    SampleBackendWebServiceState,
    StatisticsRouterState
  > {}
export class StatisticsWebRouter extends WebRouter<
  SampleBackendWebServiceState,
  StatisticsRouterState
> {
  constructor(props: StatisticsRouterProps) {
    super({
      ...props,
      name: "StatisticsWebRouter",
      path: "stats",
      stateConverter: StatisticsRouterStateConverter,
      webControllerClasses: [UpTimeController],
      middleware: [
        SwizzyRequestMiddleware,
        RequestIdMiddleware,
        RequestLoggerMiddleware,
      ],
    });
  }
}

const StatisticsRouterStateConverter: StateConverter<
  SampleBackendWebServiceState,
  StatisticsRouterState
> = async function (
  props: StateConverterProps<SampleBackendWebServiceState>,
): Promise<StatisticsRouterState> {
  return { ...props.state };
};
