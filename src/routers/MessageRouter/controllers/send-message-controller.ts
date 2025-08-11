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
import { MessageRouterState } from "../message-router.js";
// @ts-ignore
import { Request, Response, NextFunction, json } from "@swizzyweb/express";

export interface SendMessageControllerState {
  messageStore: Map<String, String>;
}

export interface SendMessageControllerProps
  extends IWebControllerProps<MessageRouterState, SendMessageControllerState> {}

export class SendMessageController extends WebController<
  MessageRouterState,
  SendMessageControllerState
> {
  constructor(props: SendMessageControllerProps) {
    super({
      ...props,
      name: "SendMessageController",
      action: "send",
      method: RequestMethod.put,
      stateConverter: DefaultStateExporter,
      middleware: [json, SendMessageValidationMiddleware],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<MessageRouterState> & {
      state: SendMessageControllerState | undefined;
    },
  ): Promise<WebControllerFunction> {
    const logger = this.logger;
    const getState = this.getState.bind(this);
    return async function (req: SendMessageRequest, res: Response) {
      try {
        const { messageStore } = getState()!;
        const { message } = req.body;
        const messageId = crypto.randomUUID();
        messageStore.set(messageId, message);
        logger.info(`Stored message ${messageId}`);
        res.json({
          info: "Message sent",
          messageId,
        });
      } catch (e: any) {
        res.status(500);
        res.json({ message: "Internal error occurred" });
      }
    };
  }
}

export const SendMessageValidationMiddleware: SwizzyMiddleware<SendMessageControllerState> =
  function (props: SwizzyMiddlewareProps<SendMessageControllerState>) {
    return function (req: Request, res: Response, next: NextFunction) {
      const { message } = req.body;
      if (!message) {
        res.status(400);
        res.json({ message: `Invalid request` });
        return;
      }
      if (typeof message !== "string") {
        res.status(400);
        res.json({ message: `Invalid request` });
        return;
      }
      next();
    };
  };

type SendMessageRequest = Request & {
  body: {
    message: string;
  };
};
