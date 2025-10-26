import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { Connection } from '@temporalio/client';
import { TEMPORAL_CONNECTION_TOKEN } from '../common/application/workflow/temporal.constant';

@Module({
  providers: [],
})
export class RootWorkflowModule implements OnModuleDestroy {
  constructor(
    @Inject(TEMPORAL_CONNECTION_TOKEN)
    private readonly connection: Connection,
  ) {}

  async onModuleDestroy() {
    await this.connection.close();
  }
}
