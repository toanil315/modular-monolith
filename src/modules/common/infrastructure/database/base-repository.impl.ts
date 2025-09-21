import {
  Repository,
  DataSource,
  EntityTarget,
  ObjectLiteral,
  DeepPartial,
} from 'typeorm';
import { DomainEventPublisher } from '../domain-event/domain-event.publisher';
import { Entity } from '../../domain/entity'; // your base Entity with domain events

export abstract class BaseRepository<
  TDomain extends Entity,
  TOrmEntity extends ObjectLiteral,
> {
  protected readonly ormRepo: Repository<TOrmEntity>;

  constructor(
    dataSource: DataSource,
    entity: EntityTarget<TOrmEntity>,
    protected readonly domainEventPublisher: DomainEventPublisher,
  ) {
    this.ormRepo = dataSource.getRepository(entity);
  }

  protected async persist(
    domainEntity: TDomain,
    ormEntity: DeepPartial<TOrmEntity>,
  ) {
    await this.ormRepo.save(ormEntity);
    await this.domainEventPublisher.publish(domainEntity);
  }
}
