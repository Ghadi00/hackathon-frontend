export type AppStorage = {
  set(key: string, value: any): void;
  get(key: string): any;
  remove(key: string): void;
  clear(): void;
};

export type SessionStorage = {
  set(key: string, value: any): void;
  get(key: string): any;
  remove(key: string): void;
  clear(): void;
};
