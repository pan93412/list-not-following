import { TwitterLister } from "../src/adapters/twitter.js";

/**
 * Get one on: <https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api>
 */
 const token = process.env.TWITTER_BEARER_TOKEN;

 if (!token) throw new Error("No Twitter bearer token found");

const client = new TwitterLister(token);

const id = await client.getTwitterId("byStarTW");
const followers = await client.getTwitterFollowers(id);

console.table(followers);
