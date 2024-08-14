import packageJson from "package-json";
import { z } from "zod";

const monthlyDownloadsSchema = z.object({
  downloads: z.number(),
});

const packageJsonSchema = z.object({
  version: z.string(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  deprecated: z.string().optional(),
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
  };
}
