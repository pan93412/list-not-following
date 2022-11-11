import { TwitterApi, type UserV2 } from 'twitter-api-v2';
import { unique } from './utils/unique.js';

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

    async _getTwitterFollowers(userId: string, nextToken?: string): Promise<UserV2[]> {
        const { data, meta } = await this.#client.v2.followers(userId, {
            pagination_token: nextToken,
        });

        if (meta.next_token) {
            data.push(
                ...(await this._getTwitterFollowers(userId, meta.next_token))
            )
        }

        return data;
    }

    async getTwitterFollowers(userId: string): Promise<UserContainer> {
        return unique(await this._getTwitterFollowers(userId));
    }
}
