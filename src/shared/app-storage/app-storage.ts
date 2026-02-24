import type {
  SessionStorage,
  AppStorage,
} from "../models/global/app-storage.model";

const appStorage: AppStorage = {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    return JSON.parse(item);
  },
  set(key: string, value: any) {
    const str = JSON.stringify(value);
    localStorage.setItem(key, str);
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};

const seshStorage: SessionStorage = {
  get<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    if (!item) return null;

    return JSON.parse(item);
  },
  set(key: string, value: any) {
    const str = JSON.stringify(value);
    sessionStorage.setItem(key, str);
  },
  remove(key: string) {
    sessionStorage.removeItem(key);
  },
  clear() {
    sessionStorage.clear();
  },
};

export { appStorage, seshStorage };
