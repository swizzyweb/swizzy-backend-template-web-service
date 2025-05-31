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
import { MessageRouterState } from "../message-router";
// @ts-ignore
import { Request, Response, NextFunction } from "@swizzyweb/express";

export interface GetMessageControllerState {
  messageStore: Map<String, String>;
}

export interface GetMessageControllerProps
  extends IWebControllerProps<MessageRouterState, GetMessageControllerState> {}

export class GetMessageController extends WebController<
  MessageRouterState,
  GetMessageControllerState
> {
  constructor(props: GetMessageControllerProps) {
    super({
      ...props,
      name: "GetMessageController",
      action: "get",
      method: RequestMethod.get,
      stateConverter: DefaultStateExporter,
      middleware: [GetMessageValidationMiddleware],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<MessageRouterState> & {
      state: GetMessageControllerState | undefined;
    },
  ): Promise<WebControllerFunction> {
    const logger = this.logger;
    const getState = this.getState.bind(this);
    return async function (req: GetMessageRequest, res: Response) {
      try {
        const { messageStore } = getState()!;
        const { messageId } = req.query;
        logger.info(`Received request for message ${messageId}`);
        const message = messageStore.get(messageId);
        if (!message) {
          res.status(404);
          res.end();
          return;
        }
        logger.debug(`Message found ${messageId}, sending`);
        res.json({
          message,
        });
      } catch (e: any) {
        res.status(500);
        res.json({ message: "Internal error occurred" });
      }
    };
  }
}

export const GetMessageValidationMiddleware: SwizzyMiddleware<GetMessageControllerState> =
  function (props: SwizzyMiddlewareProps<GetMessageControllerState>) {
    return function (req: Request, res: Response, next: NextFunction) {
      const { messageId } = req.query;
      if (!messageId) {
        res.status(400);
        res.json({ message: `Invalid request` });
        return;
      }
      if (typeof messageId !== "string") {
        res.status(400);
        res.json({ message: `Invalid request` });
        return;
      }
      next();
    };
  };

type GetMessageRequest = Request & {
  query: {
    messageId: string;
  };
};
