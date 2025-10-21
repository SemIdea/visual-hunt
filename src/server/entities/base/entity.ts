type IEntityDatabaseRepository<Entity, R extends IEntityRepositoriesBasic> = {
  create: (
    id: string,
    data: Omit<Entity, "id" | "createdAt" | "updatedAt">
  ) => Promise<Entity>;
  read: (id: string) => Promise<Entity | null>;
  update: (id: string, data: Partial<Omit<Entity, "id">>) => Promise<Entity>;
  delete: (id: string) => Promise<boolean>;
  bulkCreate?: (data: Entity[]) => Promise<string[]>;
  bulkRead?: (ids: string[]) => Promise<Array<Entity | null>>;
  bulkUpdate?: (data: Partial<Entity>[]) => Promise<string[]>;
  bulkDelete?: (ids: string[]) => Promise<string[]>;
} & R;

type IEntityCacheRepository = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ttl?: number) => Promise<boolean>;
  del: (key: string) => Promise<boolean>;
  // flush: () => Promise<boolean>;
  // size: () => Promise<number>;
  bulkGet?: (keys: string[]) => Promise<string[]>;
  bulkSet: (
    values: {
      key: string;
      value: string;
      ttl?: number;
    }[]
  ) => Promise<boolean>;
  bulkDel: (keys: string[]) => Promise<boolean>;
  scan: (pattern: string) => Promise<string | null>;
};

type IEntityBasic = {
  id: string;
};

type IEntityRepositoriesBasic = object;

type IEntityRepositories<Entity, Repos extends IEntityRepositoriesBasic> = {
  database: IEntityDatabaseRepository<Entity, Repos>;
  cache?: IEntityCacheRepository;
};

type IEntityCreateReq<Entity, Repos extends IEntityRepositoriesBasic> = {
  id: string;
  data: Omit<Entity, "id" | "createdAt" | "updatedAt">;
  repositories: IEntityRepositories<Entity, Repos>;
};

type IEntityReadReq<Entity, Repos extends IEntityRepositoriesBasic> = {
  id: string;
  repositories: IEntityRepositories<Entity, Repos>;
};

type IEntityUpdateReq<Entity, Repos extends IEntityRepositoriesBasic> = {
  id: string;
  data: Partial<Omit<Entity, "id">>;
  repositories: IEntityRepositories<Entity, Repos>;
};

type IEntityDeleteReq<Entity, Repos extends IEntityRepositoriesBasic> = {
  id: string;
  data: Entity;
  repositories: IEntityRepositories<Entity, Repos>;
};

type ICacheEntityReq<Entity> = {
  data: Entity;
  repositories: {
    cache: IEntityCacheRepository;
  };
};

type IReadCachedEntityByIndexReq<Indexes extends string> = {
  value: string;
  index: Indexes;
  repositories: {
    cache: IEntityCacheRepository;
  };
};

type IDeleteCacheEntityReq<Entity> = {
  data: Entity;
  repositories: {
    cache: IEntityCacheRepository;
  };
};

type CacheConfig<Base extends string, Indexes extends string> = {
  key: `${Base}`;
  ttl: number;
  indexes: Indexes[];
};

class BaseEntity<
  Entity extends IEntityBasic,
  Repos extends IEntityRepositoriesBasic,
  BaseIndex extends string = "",
  Indexes extends keyof Entity & string = never
> {
  cache?: CacheConfig<BaseIndex, Indexes>;
  shouldCache?: boolean;

  constructor({
    cache,
    shouldCache,
  }: {
    cache?: CacheConfig<BaseIndex, Indexes>;
    shouldCache?: boolean;
  }) {
    this.cache = cache;
    this.shouldCache = shouldCache;
  }

  resolveKey(template: string, data: Entity) {
    return template.replace(
      /%(\w+)%/g,
      (_, key) => data[key as keyof Entity]?.toString() || ""
    );
  }

  async cacheEntity({
    data,
    repositories,
  }: ICacheEntityReq<Entity>): Promise<void> {
    if (!this.shouldCache || !this.cache) return;

    const baseKey = this.cache.key;
    const keys = [];

    for (const indexField of this.cache.indexes) {
      const value = data[indexField];
      keys.push(`${baseKey}:${indexField}:${value}`);
    }

    await repositories.cache.bulkSet(
      keys.map((key) => ({
        key,
        value: JSON.stringify(data),
        ttl: this.cache?.ttl ?? 0,
      }))
    );
  }

  async readCachedEntity({
    value,
    index,
    repositories,
  }: IReadCachedEntityByIndexReq<Indexes>): Promise<Entity | null> {
    if (!this.cache || !repositories.cache || !this.shouldCache) return null;

    const key = `${this.cache.key}:${index}:${value}`;

    const cachedData = await repositories.cache.get(key);

    if (!cachedData) return null;

    return JSON.parse(cachedData) as Entity;
  }

  async deleteCachedEntity({
    data,
    repositories,
  }: IDeleteCacheEntityReq<Entity>): Promise<void> {
    if (!this.cache || !repositories.cache || !this.shouldCache) return;

    const keys = [];

    for (const indexField of this.cache.indexes) {
      const value = data[indexField];
      keys.push(`${this.cache.key}:${indexField}:${value}`);
    }

    await repositories.cache.bulkDel(keys);
  }

  async create({ id, data, repositories }: IEntityCreateReq<Entity, Repos>) {
    const entity = await repositories.database.create(id, data);

    await this.cacheEntity({
      data: {
        ...data,
        id,
      } as Entity,
      repositories: {
        cache: repositories.cache!,
      },
    });

    return entity;
  }

  async read({ id, repositories }: IEntityReadReq<Entity, Repos>) {
    const cachedEntity = await this.readCachedEntity({
      index: "id" as Indexes,
      value: id,
      repositories: {
        cache: repositories.cache!,
      },
    });

    if (cachedEntity) return cachedEntity;

    const entity = await repositories.database.read(id);

    if (!entity) return null;

    await this.cacheEntity({
      data: entity,
      repositories: {
        cache: repositories.cache!,
      },
    });

    return entity;
  }

  async update({ id, data, repositories }: IEntityUpdateReq<Entity, Repos>) {
    const entity = await repositories.database.update(id, data);

    await this.cacheEntity({
      data: entity,
      repositories: {
        cache: repositories.cache!,
      },
    });

    return entity;
  }

  async delete({ id, data, repositories }: IEntityDeleteReq<Entity, Repos>) {
    await this.deleteCachedEntity({
      data,
      repositories: {
        cache: repositories.cache!,
      },
    });

    return await repositories.database.delete(id);
  }
}

export { BaseEntity };
export type {
  IEntityBasic,
  IEntityRepositories,
  IEntityCreateReq,
  IEntityReadReq,
  IEntityUpdateReq,
  IEntityDeleteReq,
  IEntityDatabaseRepository,
  IEntityCacheRepository,
};
