import * as APIs from "./api";

export const handlers = [...Object.values(APIs).map((api) => api())];
