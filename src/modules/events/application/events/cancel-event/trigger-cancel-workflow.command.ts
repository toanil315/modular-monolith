import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';

export class TriggerCancelEventWorkflowCommand extends Command<Result<{ success: boolean }>> {
  constructor(
    public readonly props: {
      id: string;
    },
  ) {
    super();
  }
}
