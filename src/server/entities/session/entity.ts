import { BaseEntity } from "../base/entity";
import {
  IReadSessionBySessionTokenDTO,
  ISessionEntity,
  ISessionModel,
} from "./DTO";

class SessionEntityClass extends BaseEntity<
  ISessionEntity,
  ISessionModel,
  "session",
  "sessionToken"
> {
  async readBySessionToken({
    sessionToken,
    repositories,
  }: IReadSessionBySessionTokenDTO) {
    const cachedSession = await this.readCachedEntityByIndex({
      indexName: "sessionToken",
      indexValue: sessionToken,
      repositories,
    });

    if (cachedSession) return cachedSession;

    const session = await repositories.database.readBySessionToken(
      sessionToken
    );

    if (!session) return null;

    await this.cacheEntity({
      data: session,
      repositories,
    });

    return session;
  }

  constructor() {
    super({
      shouldCache: true,
      cache: {
        key: "session:%id%",
        ttl: 1000 * 60 * 15, // 15 minutes
      },
      index: {
        sessionToken: {
          key: "session:sessionToken:%sessionToken%",
          ttl: 1000 * 60 * 15, // 15 minutes
        },
      },
    });
  }
}

const SessionEntity = new SessionEntityClass();

export { SessionEntity };
