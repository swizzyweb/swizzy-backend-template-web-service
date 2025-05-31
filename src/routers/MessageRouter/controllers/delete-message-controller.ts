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

export interface DeleteMessageControllerState {
  messageStore: Map<String, String>;
}

export interface DeleteMessageControllerProps
  extends IWebControllerProps<
    MessageRouterState,
    DeleteMessageControllerState
  > {}

export class DeleteMessageController extends WebController<
  MessageRouterState,
  DeleteMessageControllerState
> {
  constructor(props: DeleteMessageControllerProps) {
    super({
      ...props,
      name: "DeleteMessageController",
      action: "delete",
      method: RequestMethod.delete,
      stateConverter: DefaultStateExporter,
      middleware: [DeleteMessageValidationMiddleware],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<MessageRouterState> & {
      state: DeleteMessageControllerState | undefined;
    },
  ): Promise<WebControllerFunction> {
    const logger = this.logger;
    const getState = this.getState.bind(this);
    return async function (req: DeleteMessageRequest, res: Response) {
      try {
        const { messageStore } = getState()!;
        const { messageId } = req.query;
        logger.info(`Received request for message ${messageId}`);

        if (!messageStore.has(messageId)) {
          res.status(404);
          res.end();
          return;
        }
        messageStore.delete(messageId);
        logger.debug(`Message found ${messageId} and deleted`);
        res.json({
          info: "Success",
        });
      } catch (e: any) {
        res.status(500);
        res.json({ message: "Internal error occurred" });
      }
    };
  }
}

export const DeleteMessageValidationMiddleware: SwizzyMiddleware<DeleteMessageControllerState> =
  function (props: SwizzyMiddlewareProps<DeleteMessageControllerState>) {
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

type DeleteMessageRequest = Request & {
  query: {
    messageId: string;
  };
};
