import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';

export class ClearCartCommand extends Command<Result<null>> {
  constructor(
    public readonly props: {
      customerId: string;
    },
  ) {
    super();
  }
}
