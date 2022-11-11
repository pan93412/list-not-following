import { strategy } from "./src/index.js";

const [lister, arg] = strategy.determine(process.argv[1] ?? "");
const id = await lister.determineIdFromInput(arg);

console.table(await lister.getUnfollowedUsers(id));
