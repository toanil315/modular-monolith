import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { v1 } from '@authzed/authzed-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpiceDBClient implements OnModuleInit {
  private readonly logger = new Logger(SpiceDBClient.name);
  private client!: v1.ZedPromiseClientInterface;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const endpoint = this.configService.getOrThrow('SPICEDB_ENDPOINT');
    const token = this.configService.getOrThrow('SPICEDB_TOKEN');

    this.logger.log(`Initializing SpiceDB client: ${endpoint}`);

    this.client = v1.NewClient(
      token,
      endpoint,
      v1.ClientSecurity.INSECURE_PLAINTEXT_CREDENTIALS,
    ).promises;
  }

  getClient(): v1.ZedPromiseClientInterface {
    return this.client;
  }
}
