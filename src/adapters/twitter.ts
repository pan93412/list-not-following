import { TwitterApi, type UserV2, type TwitterApiv2 } from "twitter-api-v2";
import { FsCacher } from "../cache/fs.js";
import {
  Lister,
  type UnfollowedUserStructure,
  type UserIdentifier,
} from "../lister.js";

export class TwitterLister extends Lister {
  readonly #client: TwitterApi;

  constructor(token: string) {
    super();
    this.#client = new TwitterApi(token);
  }

  async getTwitterId(username: string): Promise<string> {
    const { data } = await this.#client.v2.userByUsername(username);
    return data.id;
  }

  private async commonTwitterFetch(
    method: TwitterApiv2["followers"] | TwitterApiv2["following"],
    userId: string,
    nextToken?: string
  ): Promise<UserV2[]> {
    const { data, meta } = await method.bind(this.#client.v2)(userId, {
      pagination_token: nextToken,
    });

    if (meta.next_token) {
      data.push(
        ...(await this.commonTwitterFetch(method, userId, meta.next_token))
      );
    }

    return data;
  }

  async getTwitterFollowersWithoutCache(
    userId: string,
    nextToken?: string
  ): Promise<UserV2[]> {
    return this.commonTwitterFetch(
      this.#client.v2.followers,
      userId,
      nextToken
    );
  }

  async getTwitterFollowingWithoutCache(
    userId: string,
    nextToken?: string
  ): Promise<UserV2[]> {
    return this.commonTwitterFetch(
      this.#client.v2.following,
      userId,
      nextToken
    );
  }

  async getTwitterFollowers(userId: string): Promise<UserV2[]> {
    const cacher = new FsCacher<UserV2[]>(`twitter-followers--${userId}`);
    return cacher.retrieveWithDefault(() =>
      this.getTwitterFollowersWithoutCache(userId)
    );
  }

  async getTwitterFollowing(userId: string): Promise<UserV2[]> {
    const cacher = new FsCacher<UserV2[]>(`twitter-following--${userId}`);
    return cacher.retrieveWithDefault(() =>
      this.getTwitterFollowingWithoutCache(userId)
    );
  }

  async getUnfollowedUsers(id: string): Promise<UnfollowedUserStructure[]> {
    const [followers, following] = await Promise.all([
      this.getTwitterFollowers(id),
      this.getTwitterFollowing(id),
    ]);

    const followersUsernames = new Set(followers.map((user) => user.username));

    const unfollowedUsers = following.filter(
      (user) => !followersUsernames.has(user.username)
    );

    return unfollowedUsers.map((user) => ({
      username: user.username,
      url: `https://twitter.com/${user.username}`,
    }));
  }

  async determineIdFromInput(userInputs: string): Promise<UserIdentifier> {
    if (userInputs.startsWith("@"))
      return this.getTwitterId(userInputs.slice(1));

    if (userInputs.startsWith("https://twitter.com/"))
      return this.getTwitterId(userInputs.slice("https://twitter.com/".length));

    return userInputs;
  }
}
