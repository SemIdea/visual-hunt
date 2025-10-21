import { BaseEntity } from "../base/entity";
import {
  AppSessionData,
  InvalidateAllSessionsCacheDTO,
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

    if (repositories.cache) {
      const cachedData = await repositories.cache.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData) as AppSessionData;
      }
    }

    const session =
      await repositories.database.readWithUserAndSubscriptionBySessionToken(
        sessionToken
      );

    if (!session) return null;

    if (this.cache) {
      await repositories.cache.set(
        cacheKey,
        JSON.stringify(session),
        this.cache.ttl
      );
    }

    return session;
  }

  async invalidateAllSessionsCache({
    userId,
    repositories,
  }: InvalidateAllSessionsCacheDTO): Promise<void> {
    const sessions = await repositories.database.readUserSessions(userId);

    for (const session of sessions) {
      const cacheKey = this._buildAppSessionKey(session.sessionToken);
      if (repositories.cache) {
        await repositories.cache.del(cacheKey);
      }
    }
  }

  constructor() {
    super({
      shouldCache: true,
      cache: {
        key: "session",
        ttl: 1000 * 60 * 15, // 15 minutes
        indexes: ["id"],
      },
    });
  }
}

const SessionEntity = new SessionEntityClass();

export { SessionEntity };
