import { FactoryProvider } from '@nestjs/common';
import { RESTATE_CLIENT_TOKEN } from '../../application/workflow/restate.constant';
import { ConfigService } from '@nestjs/config';
import { connect } from '@restatedev/restate-sdk-clients';

export const RestateClientProvider: FactoryProvider = {
  provide: RESTATE_CLIENT_TOKEN,
  useFactory: (configService: ConfigService) => {
    const restateUrl = configService.getOrThrow('RESTATE_URL');
    return connect({ url: restateUrl });
  },
  inject: [ConfigService],
};
