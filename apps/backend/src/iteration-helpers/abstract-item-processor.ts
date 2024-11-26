import pMap from "p-map";
import pThrottle from "p-throttle";
import prettyMilliseconds from "pretty-ms";

import { SQL } from "@repo/db/drizzle";
import { TaskLoopOptions, TaskRunnerContext } from "@/task-types";
import { aggregateResults, MetaResult } from "./utils";

type QueryOptions = {
  where?: SQL;
};

export abstract class ItemProcessor<T> {
  context: TaskRunnerContext;
  loopOptions: TaskLoopOptions;

  abstract type: string;
  abstract getAllItemsIds(where?: SQL): Promise<string[]>;
  abstract getItemById(id: string): Promise<T>;
  abstract toString(item: T): string;

  constructor(context: TaskRunnerContext, loopOptions: TaskLoopOptions) {
    this.context = context;
    this.loopOptions = loopOptions;
  }

  async processItems<U>(
    mapper: (item: T, index: number) => Promise<{ data: U; meta: MetaResult }>,
    options?: QueryOptions
  ) {
    const { logger } = this.context;
    const { concurrency, throttleInterval } = this.loopOptions;
    const { where } = options || {};

    const throttle = pThrottle({
      limit: 1,
      interval: throttleInterval,
      onDelay: () => {
        logger.trace("Reached interval limit, call is delayed");
      },
    });
    const throttledMapper = throttle(mapper);

    logger.info(`Finding ids of ${this.type}s to process...`);
    const ids = await this.getAllItemsIds(where);
    logger.start(`Processing ${ids.length} ${this.type}(s)...`);

    const start = Date.now();
    const results = await pMap(
      ids,
      async (id, index) => {
        const item = await this.getItemById(id);
        try {
          logger.debug(
            `> Processing ${this.type} #${index + 1}`,
            this.toString(item)
          );
          const result = await throttledMapper(item, index);
          logger.debug(
            `Processed ${this.type} ${this.toString(item)}`,
            result.meta
          );
          return result;
        } catch (error) {
          logger.error(
            `Error processing ${this.type} ${this.toString(item)}`,
            error
          );
          if (error instanceof Error && error.cause) logger.debug(error.cause);
          return { meta: { error: true }, data: null };
        }
      },
      { concurrency }
    );

    const end = Date.now();
    const duration = end - start;
    const average = ids.length ? duration / ids.length : 0;

    logger.info(
      `Processed ${ids.length} ${this.type}(s) in ${prettyMilliseconds(
        duration
      )} (Avg: ${prettyMilliseconds(average)})`
    );

    return aggregateResults(results);
  }
}
