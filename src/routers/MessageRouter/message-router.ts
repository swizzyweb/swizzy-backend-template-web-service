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
import { SendMessageController } from "./controllers/send-message-controller.js";
import { GetMessageController } from "./controllers/get-message-controller.js";
import { DeleteMessageController } from "./controllers/delete-message-controller.js";

export interface MessageRouterState {
  messageStore: Map<String, String>;
}

export interface MessageRouterProps
  extends IWebRouterProps<SampleBackendWebServiceState, MessageRouterState> {}
export class MessageWebRouter extends WebRouter<
  SampleBackendWebServiceState,
  MessageRouterState
> {
  constructor(props: MessageRouterProps) {
    super({
      ...props,
      name: "MessageWebRouter",
      path: "message",
      stateConverter: MessageRouterStateConverter,
      webControllerClasses: [
        SendMessageController,
        GetMessageController,
        DeleteMessageController,
      ],
      middleware: [
        SwizzyRequestMiddleware,
        RequestIdMiddleware,
        RequestLoggerMiddleware,
      ],
    });
  }
}

const MessageRouterStateConverter: StateConverter<
  SampleBackendWebServiceState,
  MessageRouterState
> = async function (
  props: StateConverterProps<SampleBackendWebServiceState>,
): Promise<MessageRouterState> {
  return { ...props.state };
};
