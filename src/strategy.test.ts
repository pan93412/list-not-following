import { InvalidInputFormat } from "./exceptions/InvalidInputFormat.js";
import { NoSuchLister } from "./exceptions/NoSuchLister.js";
import { Lister, UnfollowedUserStructure } from "./lister.js";
import { ListerStrategy } from "./strategy.js";

class DemoLister extends Lister {
  getUnfollowedUsers(): Promise<UnfollowedUserStructure[]> {
    throw new Error("Method not implemented.");
  }

  determineIdFromInput(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

test("should return the correct lister if ID is correct", () => {
  const strategy = new ListerStrategy();
  const lister = new DemoLister();
  strategy.set("demo", lister);

  expect(strategy.determine("demo:foobar")).toEqual([lister, "foobar"]);
});

test("should throw error if userInput is not in `lister:arg` form", () => {
  const strategy = new ListerStrategy();
  const lister = new DemoLister();
  strategy.set("demo", lister);

  expect(() => strategy.determine("demo")).toThrow(InvalidInputFormat);
  expect(() => strategy.determine("demo:")).toThrow(InvalidInputFormat);
  expect(() => strategy.determine(":demo")).toThrow(InvalidInputFormat);
});

test("should throw error if lister is not registered.", () => {
  const strategy = new ListerStrategy();
  expect(() => strategy.determine("foo:bar")).toThrow(NoSuchLister);
});
