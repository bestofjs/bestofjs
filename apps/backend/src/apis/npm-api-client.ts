import pTimeout, { TimeoutError } from "p-timeout";
import packageJson from "package-json";
import { z } from "zod";

const timeout = 100e3; // prevent API request from taking more than N milliseconds

const monthlyDownloadsSchema = z.object({
  downloads: z.number(),
});

const packageJsonSchema = z.object({
  version: z.string(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  deprecated: z.string().optional(),
});

const bundleDataSchema = z.object({
  version: z.string(), // includes the version of the package E.g. "redux@5.0.1"
  size: z.object({
    uncompressedSize: z.string(),
    rawUncompressedSize: z.number(),
    rawCompressedSize: z.number(),
    compressedSize: z.string(),
  }),
});

export function createNpmClient() {
  return {
    async fetchPackageInfo(packageName: string) {
      const data = await packageJson(packageName).catch((err) => {
        throw new Error(`Invalid response from npm registry "${packageName}"`, {
          cause: err,
        });
      });
      const parsedData = packageJsonSchema.parse(data);
      return parsedData;
    },

    async fetchMonthlyDownloadCount(packageName: string) {
      const url = `https://api.npmjs.org/downloads/point/last-month/${packageName}`;
      const data = await fetch(url).then((res) => res.json());
      const parsedData = monthlyDownloadsSchema.parse(data);
      return parsedData.downloads;
    },

    async fetchBundleData(packageName: string) {
      const url = `https://deno.bundlejs.com/?q=${encodeURIComponent(
        packageName,
      )}`;
      try {
        const data = await pTimeout(
          fetch(url).then((res) => res.json()),
          { milliseconds: timeout },
        );
        const parsedData = bundleDataSchema.parse(data);
        return {
          size: parsedData.size.rawUncompressedSize,
          gzip: parsedData.size.rawCompressedSize,
          version: extractPackageVersion(parsedData.version),
        };
      } catch (error) {
        if (error instanceof TimeoutError) {
          return { error: "timeout" };
        }
        return { error: (error as Error).message };
      }
    },
  };
}

function extractPackageVersion(input: string) {
  const parts = input.split("@");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}
