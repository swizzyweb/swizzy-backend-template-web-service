import { IWebServiceProps, WebService } from "@swizzyweb/swizzy-web-service";
import { HelloWebRouter } from "./routers/HelloRouter/hello-router.js";


export interface SwizzyBackendTemplateWebServiceState {

}

export interface SwizzyBackendTemplateWebServiceProps extends IWebServiceProps<SwizzyBackendTemplateWebServiceState> {
  port: number;
  path?: string;
}

export class SwizzyBackendTemplateWebService extends WebService<SwizzyBackendTemplateWebServiceState> {
  constructor(props: SwizzyBackendTemplateWebServiceProps) {
    super({
      ...props,
      name: "SwizzyBackendTemplateWebService",
      path: props.path ?? "api",
      packageName: "@swizzyweb/swizzy-backend-template-web-service",
      routerClasses: [
        HelloWebRouter,

      ],
      middleware: [],
    });
  }
}
