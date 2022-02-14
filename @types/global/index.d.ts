declare module "global" {
  export namespace app_types {
    interface AccessLog {
      productId: string;
      optionId: string | null;
      os: "MOBILE" | "DESKTOP";
    }
  }
}
