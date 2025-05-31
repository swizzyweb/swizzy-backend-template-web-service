import {
  DefaultStateExporter,
  IWebControllerInitProps,
  IWebControllerProps,
  RequestMethod,
  WebController,
  WebControllerFunction,
} from "@swizzyweb/swizzy-web-service";
import { StatisticsRouterState } from "../statistics-router";
// @ts-ignore
import { Request, Response } from "@swizzyweb/express";

export interface UpTimeControllerState {
  serverStartTime: number;
}

export interface UpTimeControllerProps
  extends IWebControllerProps<StatisticsRouterState, UpTimeControllerState> {}

export class UpTimeController extends WebController<
  StatisticsRouterState,
  UpTimeControllerState
> {
  constructor(props: UpTimeControllerProps) {
    super({
      ...props,
      name: "UpTimeController",
      action: "uptime",
      method: RequestMethod.get,
      stateConverter: DefaultStateExporter,
      middleware: [],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<StatisticsRouterState> & {
      state: UpTimeControllerState | undefined;
    },
  ): Promise<WebControllerFunction> {
    const logger = this.logger;
    const getState = this.getState.bind(this);
    return async function (req: Request, res: Response) {
      try {
        const { serverStartTime } = getState()!;
        const now = Date.now();
        const upTime = now - serverStartTime;
        res.json({
          now,
          upSince: {
            epoch: serverStartTime,
            date: new Date(serverStartTime),
          },
          upTime,
        });
      } catch (e: any) {
        res.status(500);
        res.json({ message: "Internal error occurred" });
      }
    };
  }
}
