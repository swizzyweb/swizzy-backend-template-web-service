import { SwizzyBackendTemplateWebService } from "./web-service.js";


export interface GetSwizzyBackendTemplateWebServiceProps {
  serviceArgs: {

  };
}

export async function getWebservice(props: GetSwizzyBackendTemplateWebServiceProps & any) {
  const state = {

  };
  return new SwizzyBackendTemplateWebService({
    ...props,
    ...props.serviceArgs,
    state,
  });
}
