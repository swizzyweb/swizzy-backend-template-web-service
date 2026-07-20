import { createTestApp } from "@swizzyai/swizzy-web-service-test-framework";
import {
  SwizzyBackendTemplateWebService,
  SwizzyBackendTemplateWebServiceState,
} from "../../src/web-service.js";

export async function createSwizzyBackendTemplateTestApp(
  overrides: Partial<SwizzyBackendTemplateWebServiceState> = {},
) {
  return createTestApp(
    (app, logger) =>
      new SwizzyBackendTemplateWebService({
        port: 0,
        app,
        logger,
        state: { ...overrides } as SwizzyBackendTemplateWebServiceState,
      }),
  );
}
