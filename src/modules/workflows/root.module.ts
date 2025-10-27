import { Module, OnModuleInit } from '@nestjs/common';
import { CommonModule } from '../common/root.module';
import { RootEventsModule } from '../events/root.module';
import { CancelEventWorkflow } from './workflows/cancel-event.workflow';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [CommonModule, RootEventsModule],
  providers: [CancelEventWorkflow],
  exports: [CancelEventWorkflow],
})
export class RootWorkflowModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const listenerPort = this.configService.getOrThrow('RESTATE_LISTENER_PORT');
    await fetch('http://localhost:9070/deployments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uri: `http://host.docker.internal:${listenerPort}`,
      }),
    });
  }
}
