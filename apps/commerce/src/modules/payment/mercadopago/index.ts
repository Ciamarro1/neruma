import { ModuleProvider, Modules } from '@medusajs/framework/utils';
import { MercadoPagoPaymentProviderService } from './service.js';

export default ModuleProvider(Modules.PAYMENT, {
  services: [MercadoPagoPaymentProviderService],
});
