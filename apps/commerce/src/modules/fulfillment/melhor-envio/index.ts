import { ModuleProvider, Modules } from '@medusajs/framework/utils';
import { MelhorEnvioFulfillmentService } from './service.js';

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [MelhorEnvioFulfillmentService],
});
