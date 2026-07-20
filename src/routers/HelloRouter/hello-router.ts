import {
  IWebRouterProps,
  StateConverter,
  StateConverterProps,
  WebRouter,
  SwizzyRequestMiddleware,
  RequestIdMiddleware,
  RequestLoggerMiddleware,
} from "@swizzyweb/swizzy-web-service";
import { SwizzyBackendTemplateWebServiceState } from "../../web-service.js";
import { WorldController } from "./controllers/world-controller.js";


/** State held by HelloWebRouter. */
export interface HelloRouterState {

}

export interface HelloRouterProps
  extends IWebRouterProps<SwizzyBackendTemplateWebServiceState, HelloRouterState> {}

/**
 * HelloWebRouter — routes all /hello requests.
 *
 * Controllers: 0
 */
export class HelloWebRouter extends WebRouter<
  SwizzyBackendTemplateWebServiceState,
  HelloRouterState
> {
  constructor(props: HelloRouterProps) {
    super({
      ...props,
      name: "HelloWebRouter",
      path: "hello",
      stateConverter: HelloWebRouterStateConverter,
      webControllerClasses: [
        WorldController,

      ],
      middleware: [
        SwizzyRequestMiddleware,
        RequestIdMiddleware,
        RequestLoggerMiddleware,
      ],
    });
  }
}

const HelloWebRouterStateConverter: StateConverter<
  SwizzyBackendTemplateWebServiceState,
  HelloRouterState
> = async function (
  props: StateConverterProps<SwizzyBackendTemplateWebServiceState>,
): Promise<HelloRouterState> {
  return { ...props.state };
};
