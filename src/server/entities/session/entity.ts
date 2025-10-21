import { BaseEntity } from "../base/entity";
import {
  AppSessionData,
  IReadSessionBySessionTokenDTO,
  ISessionEntity,
  ISessionModel,
} from "./DTO";

class SessionEntityClass extends BaseEntity<
  ISessionEntity,
  ISessionModel,
  "session",
  "id" | "sessionToken"
> {
  private _buildAppSessionKey(token: string): string {
    return `app-session:${token}`;
  }

  async readBySessionToken({
    sessionToken,
    repositories,
  }: IReadSessionBySessionTokenDTO): Promise<AppSessionData | null> {
    const cacheKey = this._buildAppSessionKey(sessionToken);

    // 1. Try to get the COMBINED data from cache
    if (repositories.cache) {
      const cachedData = await repositories.cache.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData) as AppSessionData;
      }
    }

    // 2. Cache miss: Go to the database
    const session = await repositories.database.readBySessionToken(
      sessionToken
    );

    if (!session) return null;

    console.log("Fetched session from DB:", session);

    // Use the injected repos
    const user = await repositories.user.read(session.userId);
    if (!user) return null; // Or handle as error

    // Assuming subscription ID is on the user
    // const subscription = user.subscriptionId
    //   ? await repositories.database.subscriptionRepo.read(user.subscriptionId)
    //   : null;

    // 3. Assemble the combined data
    const appSessionData: AppSessionData = {
      session,
      user,
    };

    // 4. Cache the combined data for next time
    if (this.cache) {
      // Use the main session TTL
      await repositories.cache.set(
        cacheKey,
        JSON.stringify(appSessionData),
        this.cache.ttl
      );
    }

    return appSessionData;
  }

  constructor() {
    super({
      shouldCache: true,
      cache: {
        key: "session",
        ttl: 1000 * 60 * 15, // 15 minutes
        indexes: ["id", "sessionToken"],
      },
    });
  }
}

const SessionEntity = new SessionEntityClass();

export { SessionEntity };
