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
import { FunnyJokeController } from "./controllers/funny-joke-controller";
import { IFunnyJokeClient } from "../../client";
export interface FunnyRouterState {
  funnyJokeClient: IFunnyJokeClient;
}

export interface FunnyRouterProps
  extends IWebRouterProps<SampleBackendWebServiceState, FunnyRouterState> {}
export class FunnyWebRouter extends WebRouter<
  SampleBackendWebServiceState,
  FunnyRouterState
> {
  constructor(props: FunnyRouterProps) {
    super({
      ...props,
      name: "FunnyWebRouter",
      path: "funny",
      stateConverter: FunnyRouterStateConverter,
      webControllerClasses: [FunnyJokeController],
      middleware: [
        SwizzyRequestMiddleware,
        RequestIdMiddleware,
        RequestLoggerMiddleware,
      ],
    });
  }
}

const FunnyRouterStateConverter: StateConverter<
  SampleBackendWebServiceState,
  FunnyRouterState
> = async function (
  props: StateConverterProps<SampleBackendWebServiceState>,
): Promise<FunnyRouterState> {
  return { ...props.state };
};
