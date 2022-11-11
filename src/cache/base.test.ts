import {jest} from '@jest/globals';
import {
  BaseCacherAbstract,
  type CacheRetrieveOptions,
  type CacheWriteOptions,
} from "./base.js";

type RetrieveFunction<T> = (...args: any) => Promise<T>;
type WriteFunction = (...args: any) => Promise<void>;

const globalRetrieveFunction = jest.fn<RetrieveFunction<null>>().mockResolvedValue(null);
const globalWriteFunction = jest.fn<WriteFunction>().mockResolvedValue(undefined);

class TestCacher extends BaseCacherAbstract<string> {
  retrieve(options?: CacheRetrieveOptions | undefined): Promise<string | null> {
    return globalRetrieveFunction(this.uniqueCacheId, options);
  }

  write(value: string, options?: CacheWriteOptions | undefined): Promise<void> {
    return globalWriteFunction(this.uniqueCacheId, value, options);
  }

  _utGetUniqueCacheId() {
    return this.uniqueCacheId;
  }
}

describe("Check if the basic functions of BaseCacherAbstract works", () => {
  beforeEach(() => {
    globalRetrieveFunction.mockClear();
    globalWriteFunction.mockClear();
  });

  it("The uniqueCacheId should be that one we passed in", () => {
    for (const id of ["test", "你好", "😂"]) {
      const cacher = new TestCacher(id);
      expect(cacher._utGetUniqueCacheId()).toBe(id);
    }
  });

  describe("retrieve()", () => {
    it("without options, the first parameter should be undefined", () => {
      const cacher = new TestCacher("hello");
      cacher.retrieve();

      expect(globalRetrieveFunction).toBeCalledTimes(1);
      expect(globalRetrieveFunction).toBeCalledWith("hello", undefined);
    });

    it("with options, the first parameter should be the user-provided value", () => {
      const cacher = new TestCacher("hello");
      cacher.retrieve({});

      expect(globalRetrieveFunction).toBeCalledTimes(1);
      expect(globalRetrieveFunction).toBeCalledWith("hello", {});
    });
  });

  describe("write()", () => {
    it("without options, the parameter should be [user-provided value, undefined]", () => {
      const cacher = new TestCacher("hello");
      cacher.write("Hello, World!");

      expect(globalWriteFunction).toBeCalledTimes(1);
      expect(globalWriteFunction).toBeCalledWith("hello", "Hello, World!", undefined);
    });

    it("with options, the first parameter should be the user-provided value", () => {
      const cacher = new TestCacher("hello");
      const options = { expired: new Date(1000) };

      cacher.write("Hello, World!", options);

      expect(globalWriteFunction).toBeCalledTimes(1);
      expect(globalWriteFunction).toBeCalledWith("hello", "Hello, World!", options);
    });
  });

  describe("retrieveWithDefault()", () => {
    it("when cache hit, the write and default function shouldn't be called.", async () => {
      const cacher = new TestCacher("hello");
      const mockRetrieveFunction = jest.fn<RetrieveFunction<string>>().mockResolvedValue("foo");
      cacher.retrieve = mockRetrieveFunction;

      const defaultFunction =
        jest.fn<() => Promise<string>>().mockResolvedValue("bar");
      const retrieveValue = await cacher.retrieveWithDefault(defaultFunction);

      expect(retrieveValue).toBe("foo");
      expect(mockRetrieveFunction).toBeCalledTimes(1);
      expect(globalWriteFunction).toBeCalledTimes(0);
      expect(defaultFunction).toBeCalledTimes(0);
    });

    it("when cache doesn't hit, the write function should be called.", async () => {
      const cacher = new TestCacher("hello");

      const defaultFunction =
        jest.fn<() => Promise<string>>().mockResolvedValue("bar");
      const retrieveValue = await cacher.retrieveWithDefault(defaultFunction);

      expect(retrieveValue).toBe("bar");
      expect(globalRetrieveFunction).toBeCalledTimes(1);
      expect(globalWriteFunction).toBeCalledTimes(1);
      expect(defaultFunction).toBeCalledTimes(1);
      expect(defaultFunction).toHaveReturnedTimes(1);
    });
  });
});
