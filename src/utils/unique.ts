export function unique<T>(...arrays: (T | T[])[]): Set<T> {
  const set = new Set<T>();

  for (const array of arrays) {
    if (Array.isArray(array)) {
      for (const item of array) {
        set.add(item);
      }
    } else {
      set.add(array);
    }
  }

  return set;
}
