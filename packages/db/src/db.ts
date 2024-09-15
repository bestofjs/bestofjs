// Setup to run locally with Vercel Postgres
// Copied from https://vercel.com/docs/storage/vercel-postgres/local-development
import { neonConfig } from "@neondatabase/serverless";

if (process.env.VERCEL_ENV === "development") {
  neonConfig.wsProxy = (host) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

export * from "@vercel/postgres";
