export class InvalidInputFormat extends Error {
  constructor(public readonly input: string) {
    super(`not a valid input: ${input}`);
    this.name = InvalidInputFormat.name;
  }
}
