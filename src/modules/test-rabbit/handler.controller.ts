import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class RabbitMQController {
  @EventPattern('noti')
  async handleNoti(@Payload() data: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    console.log('PROCESS MESSAGE: ', data);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    channel.ack(originalMsg);
  }
}
