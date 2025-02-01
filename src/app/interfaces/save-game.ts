export interface SaveGame {
  save<T>(data: T): void;
  init(): void;
  destroy(): void;
}
