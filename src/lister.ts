export type UnfollowedUserStructure = {
  /**
   * The user's username.
   */
  username: string;

  /**
   * The user's profile.
   */
  url: string;
};

export type UserIdentifier = string;

/**
 * The abstract class for listing all the unfollowed users.
 */
export abstract class Lister {
  abstract getUnfollowedUsers(
    id: UserIdentifier
  ): Promise<UnfollowedUserStructure[]>;

  /**
   * Determine ID from an artificial input.
   *
   * @param userInputs The user input. It can be a username, a URL, or a user ID
   * @returns a {@link UserIdentifier}.
   * @throws if the input is invalid.
   * @example
   * determineIdFromInput("@byStarTW") // -> (Twitter ID)
   * determineIdFromInput("https://twitter.com/byStarTW") // -> (Twitter ID)
   */
  abstract determineIdFromInput(userInputs: string): Promise<UserIdentifier>;
}
