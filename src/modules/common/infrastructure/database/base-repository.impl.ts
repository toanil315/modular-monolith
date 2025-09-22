import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';
import { DomainEventPublisher } from '../domain-event/domain-event.publisher';
import { Entity } from '../../domain/entity'; // your base Entity with domain events

export abstract class BaseRepository<
  TDomain extends Entity,
  TOrmEntity extends ObjectLiteral,
> {
  constructor(
    protected readonly ormRepo: Repository<TOrmEntity>,
    protected readonly domainEventPublisher: DomainEventPublisher,
  ) {}

  protected async persist(
    domainEntity: TDomain,
    ormEntity: DeepPartial<TOrmEntity>,
  ) {
    await this.ormRepo.save(ormEntity);
    await this.domainEventPublisher.publish(domainEntity);
  }
}
