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
import { HelloRouterState } from "../hello-router.js";
import { Request, Response, NextFunction } from "express";

/** State held by WorldController. */
export interface WorldControllerState {

}

export interface WorldControllerProps
  extends IWebControllerProps<HelloRouterState, WorldControllerState> {}

/**
 * WorldController — handles GET /world requests.
 *
 * Query parameters:
 * @param {string} query.name
 */
export class WorldController extends WebController<
  HelloRouterState,
  WorldControllerState
> {
  constructor(props: WorldControllerProps) {
    super({
      ...props,
      name: "WorldController",
      action: "world",
      method: RequestMethod.get,
      stateConverter: DefaultStateExporter,
      middleware: [WorldControllerValidationMiddleware],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<HelloRouterState> & {
      state: WorldControllerState | undefined;
    },
  ): Promise<WebControllerFunction> {
    return async function (req: Request, res: Response) {
          try {
            const { name } = (req as WorldControllerRequest).query;
            res.json({ message: `Hello, ${name}!` });
          } catch (e: any) {
            res.status(500).json({ message: "Internal error occurred" });
          }
        };
  }
}

export const WorldControllerValidationMiddleware: SwizzyMiddleware<WorldControllerState> =
  function (props: SwizzyMiddlewareProps<WorldControllerState>) {
    return function (req: Request, res: Response, next: NextFunction) {
      const query = req.query;
      if (!query.name) {
        res.status(400).json({ message: "Invalid request" });
        return;
      }
      if (typeof query.name !== "string") {
        res.status(400).json({ message: "Invalid request" });
        return;
      }
      next();
    };
  };

type WorldControllerRequest = Request & {
  query: {
    name: string;
  };
};
