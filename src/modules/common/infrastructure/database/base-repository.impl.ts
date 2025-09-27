import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';
import { Entity } from '../../domain/entity'; // your base Entity with domain events
import { DomainEventPublisher } from '../../application/domain-event/domain-event.publisher';

export abstract class BaseRepository<TDomain extends Entity, TOrmEntity extends ObjectLiteral> {
  constructor(
    protected readonly ormRepo: Repository<TOrmEntity>,
    protected readonly domainEventPublisher: DomainEventPublisher,
  ) {}

  protected async persist(domainEntity: TDomain, ormEntity: DeepPartial<TOrmEntity>) {
    await this.ormRepo.save(ormEntity);
    await this.domainEventPublisher.publish(domainEntity);
  }
}
