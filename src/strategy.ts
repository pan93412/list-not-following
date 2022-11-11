import { InvalidInputFormat } from "./exceptions/InvalidInputFormat.js";
import { NoSuchLister } from "./exceptions/NoSuchLister.js";
import { Lister } from "./lister.js";

export type ListerIdentifier = string;
export class ListerStrategy extends Map<ListerIdentifier, Lister> {
  /**
   * Get the most suitable lister for the given input.
   *
   * @param userInput A {@link ListerIdentifier} with an argument,
   * separated with ':'. For example: `twitter:@byStarTW`
   * @returns The most suitable listener, and the argument (@byStarTW)
   * @throws when the input is invalid or listener is not found.
   * @examples
   * ```
   * // assume you have registered it with `.set`
   * getSuitableLister("twitter:@byStarTW") // -> [TwitterLister, "@byStarTW"]
   * ```
   */
  determine(userInput: string): [Lister, string] {
    const inputPattern = /(.+?):(.+)/;

    const matches = userInput.match(inputPattern);
    if (!matches) throw new InvalidInputFormat(userInput);

    const [_, listId, arg] = matches;

    const lister = this.get(listId);
    if (!lister) throw new NoSuchLister(listId);

    return [lister, arg];
  }
}
