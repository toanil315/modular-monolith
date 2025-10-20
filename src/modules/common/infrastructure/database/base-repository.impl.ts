import { EntityManager } from 'typeorm';

export abstract class BaseRepository {
  constructor() {}

  protected abstract withManager(manager: EntityManager): this;
}
