import { Global, Module } from '@nestjs/common';
import { SpiceDBClient } from './spicedb.client';
import { PolicyService } from './policy.service';
import { SchemaLoader } from './schema-loader';

@Global()
@Module({
  providers: [SpiceDBClient, PolicyService, SchemaLoader],
  exports: [PolicyService],
})
export class AuthzModule {}
