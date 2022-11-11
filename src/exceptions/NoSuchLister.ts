export class NoSuchLister extends Error {
  constructor(public readonly lister: string) {
    super(`no such a lister: ${lister}`);
    this.name = NoSuchLister.name;
  }
}
