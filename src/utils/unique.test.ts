import { unique } from "./unique.js";

test("can create a unique set from inputs", () => {
  const set = unique(1, 1, 2, 3, 5, 7, 9);
  expect(set).toStrictEqual(new Set([1, 2, 3, 5, 7, 9]));
});

test("can create a unique set from inputs", () => {
  const set = unique([1, 1, 2, 3, 5, 7, 9]);
  expect(set).toStrictEqual(new Set([1, 2, 3, 5, 7, 9]));
});

test("can create a unique set from inputs with arrays", () => {
  const set = unique(
    [1, 1, 2, 3, 5, 7, 9],
    [2, 3, 4, 5, 6, 7, 8],
    [3, 4, 5, 6, 7, 8, 9],
    [0, 1, 2]
  );
  expect(set).toStrictEqual(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
});
