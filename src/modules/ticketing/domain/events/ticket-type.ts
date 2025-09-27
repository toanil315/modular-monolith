import { v4 as uuidV4 } from 'uuid';
import { Entity } from '../../../common/domain/entity';
import { Result } from 'src/modules/common/domain/result';

export class TicketType extends Entity {
  constructor(
    public id: string,
    public eventId: string,
    public name: string,
    public price: number,
    public currency: string,
    public quantity: number,
  ) {
    super();
  }

  static create(eventId: string, name: string, price: number, currency: string, quantity: number) {
    const ticketType = new TicketType(uuidV4(), eventId, name, price, currency, quantity);
    return Result.success(ticketType);
  }
}
