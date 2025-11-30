import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class RabbitMQController {
  @EventPattern('noti')
  handleNoti(@Payload() data: string) {
    console.log('===DATA: ', data);
  }
}
