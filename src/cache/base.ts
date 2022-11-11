/**
 * The options for writing cache.
 */
export interface CacheWriteOptions {
  /**
   * When the cache should expire.
   */
  expired?: Date | null;
}

/**
 * The options for retrieving cache.
 */
export type CacheRetrieveOptions = Record<string, never>;

export type OptionsUnion = {
  writeOptions?: CacheWriteOptions | null;
  retrieveOptions?: CacheRetrieveOptions | null;
};

export abstract class BaseCacherAbstract<T> {
  constructor(protected readonly uniqueCacheId: string) {}

  /**
   * Retrieve the cache.
   *
   * @returns The cache, or undefined if it doesn't exist.
   */
  abstract retrieve(options?: CacheRetrieveOptions): Promise<T | null>;

  /**
   * Write value to the cache.
   *
   * @returns A void {@see Promise}. May be rejected.
   */
  abstract write(value: T, options?: CacheWriteOptions): Promise<void>;

  /**
   * Retrieve the cache, with the default handler.
   *
   * When the cache is not found, we write the default value
   * into the cache store (and return it.)
   *
   * @param defaults The value source when the cache is not found.
   * @param optionsUnion The options for write & retrieve operations.
   */
  async retrieveWithDefault(
    defaults: () => Promise<T>,
    optionsUnion?: OptionsUnion
  ): Promise<T> {
    const { writeOptions, retrieveOptions } = optionsUnion ?? {};

    const cache = await this.retrieve(retrieveOptions ?? undefined);

    // Run defaults() if the cache is not found.
    if (cache === null) {
      const value = await defaults();
      await this.write(value, writeOptions ?? undefined);
      return value;
    }

    return cache;
  }
}
