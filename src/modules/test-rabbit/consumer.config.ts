import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

export function getLetterBoxConsumerConfig(configService: ConfigService): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
      queue: 'letter_box',
      queueOptions: {
        durable: false,
      },
      prefetchCount: 2,
      noAck: false,
    },
  };
}
