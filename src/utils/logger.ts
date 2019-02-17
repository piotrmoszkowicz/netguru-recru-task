import winston, { format } from "winston";

const transports = [
  new winston.transports.Console({
    level: process.env.NODE_ENV === "production" ? "error" : "debug"
  }),
  new winston.transports.File({ filename: "debug.log", level: "debug" })
];

const formatOptions = format.combine(format.timestamp(), format.prettyPrint());

const logger = winston.createLogger({
  transports,
  format: formatOptions
});

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;
