import { FsCacher } from "../src/cache/fs.js";

const cacher = new FsCacher("ultrabase", (v) => typeof v === "string");

await cacher.retrieve();
await cacher.write("Hello World! foo", {expired:new Date()});
console.log(await cacher.retrieve());
await cacher.write("Hello World! bar");
console.log(await cacher.retrieve());
