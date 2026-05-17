declare module "iyzipay" {
  interface IyzipayOptions {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  interface IyzipayCallback {
    (err: Error | null, result: Record<string, unknown>): void;
  }

  interface IyzipayResource {
    create(request: Record<string, unknown>, callback: IyzipayCallback): void;
    retrieve(request: Record<string, unknown>, callback: IyzipayCallback): void;
  }

  class Iyzipay {
    constructor(options: IyzipayOptions);
    checkoutFormInitialize: IyzipayResource;
    checkoutForm: IyzipayResource;
    payment: IyzipayResource;
    subscription: IyzipayResource;
  }

  export = Iyzipay;
}
