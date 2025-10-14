import { v4 as uuidV4 } from 'uuid';

export class IntegrationEvent {
  static type: string;

  public readonly id: string;
  public readonly occurredOn: number;
  public readonly type: string;

  constructor(type: string) {
    this.id = uuidV4();
    this.occurredOn = Date.now();
    this.type = type;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export type IntegrationEventConstructor<T extends IntegrationEvent = IntegrationEvent> = {
  new (...args: any[]): T;
  type: string;
};
