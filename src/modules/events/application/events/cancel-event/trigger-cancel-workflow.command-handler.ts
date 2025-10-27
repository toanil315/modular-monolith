import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TriggerCancelEventWorkflowCommand } from './trigger-cancel-workflow.command';
import { Result } from 'src/modules/common/domain/result';
import { RESTATE_CLIENT_TOKEN } from 'src/modules/common/application/workflow/restate.constant';
import { Ingress } from '@restatedev/restate-sdk-clients';
import {
  CANCEL_EVENT_WORKFLOW_NAME,
  CancelEventHandler,
} from 'src/modules/workflows/public/cancel-event.workflow-definition';

@CommandHandler(TriggerCancelEventWorkflowCommand)
export class TriggerCancelEventWorkflowCommandHandler
  implements ICommandHandler<TriggerCancelEventWorkflowCommand>
{
  constructor(@Inject(RESTATE_CLIENT_TOKEN) private readonly restateClient: Ingress) {}

  async execute({ props }: TriggerCancelEventWorkflowCommand) {
    await this.restateClient
      .workflowClient<CancelEventHandler>(
        { name: CANCEL_EVENT_WORKFLOW_NAME },
        this.produceUniqueWorkflowId(props.id),
      )
      .workflowSubmit({ eventId: props.id });
    return Result.success({ success: true });
  }

  private produceUniqueWorkflowId(eventId: string) {
    return `${CANCEL_EVENT_WORKFLOW_NAME}-${eventId}-${Date.now()}`;
  }
}
