import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Connection } from '@temporalio/client';
import {
  TEMPORAL_CLIENT_TOKEN,
  TEMPORAL_CONNECTION_TOKEN,
} from '../../application/workflow/temporal.constant';

export const TemporalConnectionProvider: Provider = {
  provide: TEMPORAL_CONNECTION_TOKEN,
  useFactory: async (configService: ConfigService) => {
    const connection = await Connection.connect({
      address: configService.get<string>('TEMPORAL_ADDRESS'),
    });
    return connection;
  },
  inject: [ConfigService],
};

export const TemporalClientProvider: Provider = {
  provide: TEMPORAL_CLIENT_TOKEN,
  useFactory: (connection: Connection) => {
    return new Client({
      connection,
    });
  },
  inject: [TEMPORAL_CONNECTION_TOKEN],
};
