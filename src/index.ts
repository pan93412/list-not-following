import { TwitterLister } from "./adapters/twitter.js";
import { ListerStrategy } from "./strategy.js";

export const strategy = new ListerStrategy();

if (process.env.TWITTER_BEARER_TOKEN) {
  strategy.set("twitter", new TwitterLister(process.env.TWITTER_BEARER_TOKEN));
} else {
  console.log("TWITTER_BEARER_TOKEN is not set – not register!");
}
