import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientsModule,
  RmqOptions,
  RmqRecordBuilder,
  Transport,
} from '@nestjs/microservices';
import { RabbitMQController } from './handler.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TEST_RABBITMQ_SERVICE',
        useFactory: (configService: ConfigService): RmqOptions => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
              queue: 'letter_box',
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [RabbitMQController],
})
export class TestRabbitMQModule implements OnModuleInit {
  constructor(@Inject('TEST_RABBITMQ_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect().catch((error) => console.log(error));
    let i = 0;

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.client.emit('noti', new RmqRecordBuilder(`rabbit mq data ${i++}`).build());
    }
  }
}
