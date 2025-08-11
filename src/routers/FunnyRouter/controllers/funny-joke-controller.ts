import {
  DefaultStateExporter,
  IWebControllerInitProps,
  IWebControllerProps,
  RequestMethod,
  WebController,
  WebControllerFunction,
} from "@swizzyweb/swizzy-web-service";
import { FunnyRouterState } from "../funny-router.js";
// @ts-ignore
import { Request, Response } from "@swizzyweb/express";
import { IFunnyJokeClient } from "../../../client/index.js";

export interface FunnyJokeControllerState {
  funnyJokeClient: IFunnyJokeClient;
}

export interface FunnyJokeControllerProps
  extends IWebControllerProps<FunnyRouterState, FunnyJokeControllerState> {}

export class FunnyJokeController extends WebController<
  FunnyRouterState,
  FunnyJokeControllerState
> {
  constructor(props: FunnyJokeControllerProps) {
    super({
      ...props,
      name: "FunnyJokeController",
      action: "joke",
      method: RequestMethod.get,
      stateConverter: DefaultStateExporter,
      middleware: [],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<FunnyRouterState> & {
      state: FunnyJokeControllerState | undefined;
    },
  ): Promise<WebControllerFunction> {
    const logger = this.logger;
    const getState = this.getState.bind(this);
    return async function (req: Request, res: Response) {
      logger.info("We got a jokster lookin for jokes!");
      try {
        const { funnyJokeClient } = getState()!;
        const joke = await funnyJokeClient.getFunnyJoke({});
        res.json({
          message: "Here's your funny joke",
          joke,
        });
      } catch (e: any) {
        res.status(500);
        res.json({ message: "Internal error occurred" });
      }
    };
  }
}
