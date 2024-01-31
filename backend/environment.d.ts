export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      NODE_ENV: 'production' | 'development' | undefined;
      BACKEND_PORT: number;
      FRONTEND_URL: string;
      REDIS_URL: string | undefined;
      CACHE_TIME: string;
      BACKEND_URL: string;
      SSO_TENANT: string;
      SSO_PRODUCT: string;
      SSO_AUDIENCE: string;
    }
  }
}
