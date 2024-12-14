/**
 * A basic Map to count objects by key
 * Used to aggregate stargazer events by day
 * */
export class EventCounter<T> {
  map: Map<string, number>;
  constructor() {
    this.map = new Map();
  }

  add(keyAsObject: T, value = 1) {
    const key = this.stringify(keyAsObject);
    if (this.map.has(key)) {
      this.map.set(key, this.map.get(key)! + value);
    } else {
      this.map.set(key, value);
    }
  }

  toJSON() {
    return Array.from(this.map).map(([key, value]) => {
      return { ...this.parse(key), value } as T & { value: number };
    });
  }

  stringify(key: T) {
    return JSON.stringify(key);
  }

  parse(key: string) {
    return JSON.parse(key) as T;
  }
}
