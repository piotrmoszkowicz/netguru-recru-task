import config from "config";
import "reflect-metadata";
import { createExpressServer } from "routing-controllers";

import logger from "@utils/logger";
import database from "./database";

const app = createExpressServer({
  controllers: [__dirname + "/controllers/*.js"]
});

const port: number = config.get("app.port");

app.listen(port, async () => {
  try {
    await database.sync({ force: false });
    logger.log("info", `App is running at :${port} in ${app.get("env")} mode`);
    logger.log("info", "Press CTRL-C to stop\n");
  } catch (err) {
    logger.log("error", "Error with database", err);
  }
});
