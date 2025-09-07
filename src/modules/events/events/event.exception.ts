import { HttpStatus } from '@nestjs/common';
import { BusinessException } from 'src/modules/common/exceptions/business.exception';

export class EventNotFoundException extends BusinessException {
  constructor(eventId: string) {
    super({
      code: 'EVENT_NOT_FOUND',
      message: `Event with id ${eventId} not found`,
      status: HttpStatus.NOT_FOUND,
    });
  }
}
