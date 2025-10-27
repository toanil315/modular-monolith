import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { serve, workflow, WorkflowContext } from '@restatedev/restate-sdk';
import { EVENTS_PUBLIC_APIS_TOKEN, EventsPublicApis } from 'src/modules/events/public/apis';
import { CANCEL_EVENT_WORKFLOW_NAME } from '../public/cancel-event.workflow-definition';

@Injectable()
export class CancelEventWorkflow implements OnModuleInit {
  constructor(
    @Inject(EVENTS_PUBLIC_APIS_TOKEN) private readonly eventsPublicApis: EventsPublicApis,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const cancelEventWorkflow = workflow({
      name: CANCEL_EVENT_WORKFLOW_NAME,
      handlers: {
        run: async (context: WorkflowContext, { eventId }) => {
          await context.run('trigger cancel event', () =>
            this.eventsPublicApis.cancelEvent(eventId),
          );
        },
      },
    });

    await serve({
      port: Number(this.configService.getOrThrow('RESTATE_LISTENER_PORT')),
      services: [cancelEventWorkflow],
    });
  }
}
