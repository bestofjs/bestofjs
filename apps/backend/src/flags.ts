export const cliFlags = {
  concurrency: {
    type: Number,
    default: 1,
  },
  logLevel: {
    type: Number,
    description:
      "Log level: 0 => error, 1 => warn, 2 => log, 3 => info, 4 => debug...",
    default: 3,
  },
  limit: {
    type: Number,
    description: "Records to process",
    default: 0,
  },
  skip: {
    type: Number,
    description: "Records to skip (when paginating)",
    default: 0,
  },
  name: {
    type: String,
    description: "Full name of the GitHub repo to process",
  },
  throttleInterval: {
    type: Number,
    description: "Throttle interval in milliseconds",
  },
};
