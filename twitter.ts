import { TwitterApi, type UserV2 } from 'twitter-api-v2';

/**
 * Get one on: <https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api>
 */
const token = process.env.TWITTER_BEARER_TOKEN;

if (!token) throw new Error("No Twitter bearer token found");

export type UserContainer = Set<UserV2>;

export class TwitterNotFollowingLister {
    readonly #client: TwitterApi;

    constructor(token: string) {
        this.#client = new TwitterApi(token);
    }

    async getTwitterId(username: string): Promise<string> {
        const { data } = await this.#client.v2.userByUsername(username);
        return data.id;
    }

    private static async unique<T>(...arrays: T[] | T[][]): Promise<Set<T>> {
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

    // async getTwitterFollowers(userId: string, container: UserContainer): Promise<UserContainer> {
    //     // Initiate a new container.
    //     if (!container) container = new Set();

    //     const { data, meta } = await this.#client.v2.followers(userId);

    //     if (!meta.next_token) {
    //         data.forEach(container.add, container);
    //     } else {
    //         data.forEach(container.add, container);

    //         // Note that it may introduce the
    //         await this.getTwitterFollowers(userId, container);
    //     }
    // }
}
