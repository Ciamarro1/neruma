export interface MelhorEnvioOptions {
  apiToken: string;
  sandbox?: boolean;
  originPostalCode: string;
}

export interface MelhorEnvioPackage {
  weight: number; // kg
  width: number; // cm
  height: number; // cm
  length: number; // cm
}

export interface MelhorEnvioCalculateRequest {
  from: {
    postal_code: string;
  };
  to: {
    postal_code: string;
  };
  products?: {
    id: string;
    quantity: number;
    unitary_value: number;
    weight: number; // kg
    width: number; // cm
    height: number; // cm
    length: number; // cm
  }[];
  package?: MelhorEnvioPackage;
  options?: {
    receipt?: boolean;
    own_hand?: boolean;
    insurance_value?: number;
  };
  services?: string; // "1,2,3,4" (1=PAC, 2=SEDEX, 3=.Com, 4=Package)
}

export interface MelhorEnvioServiceRate {
  id: number;
  name: string; // "SEDEX", "PAC", ".Com", "Package"
  price: string;
  custom_price: string;
  discount: string;
  currency: string;
  delivery_time: number;
  delivery_range: {
    min: number;
    max: number;
  };
  company: {
    id: number;
    name: string; // "Correios", "Jadlog"
    picture: string;
  };
  error?: string;
}
