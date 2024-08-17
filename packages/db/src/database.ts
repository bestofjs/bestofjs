export interface DatabaseService<T> {
  db: T;
  disconnect(): void;
}
