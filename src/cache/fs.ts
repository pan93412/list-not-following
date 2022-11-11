import { promises as fs } from "fs";
import path from "path";
import { z } from 'zod';
import {
  BaseCacherAbstract,
  CacheWriteOptions,
} from "./base.js";

const cacheDataSchema = z.object({
  expiredAt: z.string().transform((v) => new Date(v)).nullable(),
  data: z.unknown(),
});

/**
 * The cacher based on filesystem.
 */
export class FsCacher<T> extends BaseCacherAbstract<T> {
  protected cacheDirComponent = "cache";

  protected get CacheFilename(): string {
    return path.join(
      this.cacheDirComponent,
      `${this.uniqueCacheId}.cache.json`
    );
  }

  constructor(
    uniqueCacheId: string,
    private readonly valueValidator: (v: unknown) => boolean = () => true,
  ) {
    super(uniqueCacheId);
  }

  async retrieve(): Promise<T | null> {
    try {
      const value = await fs.readFile(this.CacheFilename, "utf-8");
      const parsed = cacheDataSchema.safeParse(JSON.parse(value));

      // Check if the cache schema is valid.
      if (!parsed.success) {
        console.warn("Invalid cache:", parsed.error);
        return null;
      }

      const parsedData = parsed.data;

      // Check if the data is expired.
      if (parsedData.expiredAt && parsedData.expiredAt < new Date()) {
        console.warn("Cache expired: ", parsedData.expiredAt);
        return null;
      }

      // Check if the data is valid.
      if (!this.valueValidator(parsedData.data)) {
        console.warn("Invalid cache data:", parsedData.data);
        return null;
      }

      return parsedData.data as T;
    } catch (e) {
      if (e instanceof Error && "code" in e && typeof e.code === "string") {
        // No such file or directory
        if (e.code === "ENOENT") return null;
      }
      throw e;
    }
  }

  async write(
    value: T,
    options?: CacheWriteOptions | undefined
  ): Promise<void> {
    const expiredAt = options?.expired ?? null;
    const result = {
      expiredAt,
      data: value,
    } satisfies z.infer<typeof cacheDataSchema>;

    try {
      await fs.writeFile(this.CacheFilename, JSON.stringify(result), "utf-8");
    } catch (e) {
      if (e instanceof Error && "code" in e && typeof e.code === "string") {
        // No such file or directory
        if (e.code === "ENOENT") {
          await fs.mkdir(this.cacheDirComponent);
          return this.write(value, options); // try again
        }
      }
      throw e;
    }
  }
}
