import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';
import { Entity } from '../../domain/entity'; // your base Entity with domain events
import { DomainEventPublisher } from '../../application/domain-event/domain-event.publisher';

export abstract class BaseRepository<TDomain extends Entity, TOrmEntity extends ObjectLiteral> {
  constructor(
    protected readonly ormRepo: Repository<TOrmEntity>,
    protected readonly domainEventPublisher: DomainEventPublisher,
  ) {}

  protected async persist(
    domainEntity: TDomain | TDomain[],
    ormEntity: DeepPartial<TOrmEntity> | DeepPartial<TOrmEntity>[],
  ) {
    await this.ormRepo.save<DeepPartial<TOrmEntity>>(
      ormEntity as Parameters<typeof this.ormRepo.save>[0],
    );

    if (Array.isArray(domainEntity)) {
      for (const entity of domainEntity) {
        await this.domainEventPublisher.publish(entity);
      }
    } else {
      await this.domainEventPublisher.publish(domainEntity);
    }
  }
}
