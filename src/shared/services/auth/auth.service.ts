import { signal, type Signal } from "@preact/signals";

import { toast } from "react-toastify";
import { STORAGE_KEYS } from "../../../static/sotrage.keys";
import { axios_, credentialsStore } from "../../axios-client/axios-client";
import QueryApi from "../../api/query-api";
import { APP_EVENTS } from "../../../static/enums/app.events";
import type { AppStorage } from "../../models/global/app-storage.model";
import type { UserData } from "../../models/user/user.model";
import type { RegisterDto } from "../../dto/auth/register.dto";

export default class AuthService {
  private authenticated: Signal<boolean> = signal(false);
  private initializationStatus: Signal<string> = signal("Not started");
  private newStatus: Signal<string> = signal("Not started");

  private appStorage: AppStorage;
  private seshStorage: AppStorage;

  constructor(appStorage: AppStorage, seshStorage: AppStorage) {
    this.appStorage = appStorage;
    this.seshStorage = seshStorage;
  }

  async init(): Promise<void> {
    this.initializationStatus.value = "Starting";
    try {
      await this.restoreSession();
      this.initializationStatus.value = "Complete";
    } catch (error: any) {
      this.initializationStatus.value = `Failed: ${error.message}`;
      throw error;
    }
  }

  getInitializationStatus(): string {
    return this.initializationStatus.value;
  }

  getNewStatus(): string {
    return this.newStatus.value;
  }

  isLoggedIn() {
    return this.authenticated.value;
  }

  // *~~~ Auth ~~~* //

  async register(dto: RegisterDto): Promise<void> {
    await QueryApi.auth.register(dto);
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Promise<void> {
    axios_.defaults.headers.common["Authorization"] = "";
    const res = await QueryApi.auth.login({ email, password });

    const storage = rememberMe ? this.appStorage : this.seshStorage;

    // save session data
    storage.set(STORAGE_KEYS.auth_session, true);
    storage.set(STORAGE_KEYS.auth_token, res.accessToken);
    axios_.defaults.headers.common["Authorization"] =
      `Bearer ${res.accessToken}`;
    credentialsStore["Authorization"] = `Bearer ${res.accessToken}`;

    const loggedInEvent = new CustomEvent<UserData>(APP_EVENTS.AUTH_LOGGED_IN, {
      detail: {
        id: "1",
        username: res.username,
        email: res.email,
      },
    });

    document.dispatchEvent(loggedInEvent);

    this.authenticated.value = true;
  }

  async logout(): Promise<void> {
    try {
      await QueryApi.auth.logout();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      //
    }

    this.appStorage.remove(STORAGE_KEYS.auth_session);
    this.appStorage.remove(STORAGE_KEYS.auth_token);
    this.appStorage.remove(STORAGE_KEYS.generalSettings);

    this.seshStorage.remove(STORAGE_KEYS.auth_session);
    this.seshStorage.remove(STORAGE_KEYS.auth_token);
    this.seshStorage.remove(STORAGE_KEYS.generalSettings);

    axios_.defaults.headers.common["Authorization"] = "";

    const loggedOutEvent = new CustomEvent(APP_EVENTS.AUTH_LOGGED_OUT);

    document.dispatchEvent(loggedOutEvent);

    this.authenticated.value = false;
  }

  public async restoreSession(): Promise<void> {
    const loggedIn =
      this.seshStorage.get(STORAGE_KEYS.auth_session) ??
      this.appStorage.get(STORAGE_KEYS.auth_session);

    const token =
      this.seshStorage.get(STORAGE_KEYS.auth_token) ??
      this.appStorage.get(STORAGE_KEYS.auth_token);

    if (!loggedIn || !token) return;

    try {
      axios_.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      credentialsStore["Authorization"] = `Bearer ${token}`;

      const sessionInfo = await QueryApi.auth.getSession();

      const loggedInEvent = new CustomEvent<UserData>(
        APP_EVENTS.AUTH_LOGGED_IN,
        {
          detail: {
            ...sessionInfo,
            id: "1",
            username: sessionInfo.username,
            email: sessionInfo.email,
            pfp: sessionInfo.pfp,
          },
        },
      );

      document.dispatchEvent(loggedInEvent);
      this.authenticated.value = true;
    } catch (err: any) {
      console.error("Error restoring session: ", err);

      if (!err.response) {
        // Network error (e.g., no internet)
        toast.warning(
          "Unable to restore session due to network issues. Please check your connection.",
        );
        return;
      }

      if (err?.response?.data?.message?.includes("JWT expired")) {
        toast.error("Session expired. Please log in again.");
        this.logout();
        return;
      }

      if (err.response.status === 401) {
        // Unauthorized: Token is invalid or expired
        this.logout();
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(`An error occurred: ${err.message}`);
      }
    }
  }
}
