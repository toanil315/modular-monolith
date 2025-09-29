import { Repository, ObjectLiteral, DeepPartial, EntityManager } from 'typeorm';
import { Entity } from '../../domain/entity';
import { DomainEventPublisher } from '../../application/domain-event/domain-event.publisher';

export abstract class BaseRepository<TDomain extends Entity, TOrmEntity extends ObjectLiteral> {
  protected readonly manager: EntityManager;

  constructor(
    protected readonly ormRepo: Repository<TOrmEntity>,
    protected readonly domainEventPublisher: DomainEventPublisher,
    manager?: EntityManager,
  ) {
    this.manager = manager ?? ormRepo.manager;
  }

  /**
   * Creates a new instance of this repository bound to the given transaction manager.
   */
  withManager(manager: EntityManager): this {
    const ctor = this.constructor as new (
      repo: Repository<TOrmEntity>,
      publisher: DomainEventPublisher,
      manager?: EntityManager,
    ) => this;

    // 👇 Important: always resolve repo from new manager
    const newRepo = manager.getRepository<TOrmEntity>(this.ormRepo.target);
    return new ctor(newRepo, this.domainEventPublisher, manager);
  }

  protected async persist(
    domainEntity: TDomain | TDomain[],
    ormEntity: DeepPartial<TOrmEntity> | DeepPartial<TOrmEntity>[],
  ) {
    const repo = this.manager.getRepository(this.ormRepo.target as any) as Repository<TOrmEntity>;

    await repo.save<DeepPartial<TOrmEntity>>(ormEntity as Parameters<typeof repo.save>[0]);

    if (Array.isArray(domainEntity)) {
      for (const entity of domainEntity) {
        await this.domainEventPublisher.publish(entity);
      }
    } else {
      await this.domainEventPublisher.publish(domainEntity);
    }
  }
}
