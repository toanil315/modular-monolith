import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ApiZodResponse } from 'src/modules/common/infrastructure/https/api-zod-response.decorator';
import { TICKETING_END_POINT_TAGS } from '../tags';
import { CreateOrderDto, CreateOrderResponseDto } from './dtos/create-order.dto';
import { CreateOrderCommand } from '../../application/orders/create-order/create-order.command';

@ApiTags(TICKETING_END_POINT_TAGS.ORDERS)
@Controller(TICKETING_END_POINT_TAGS.ORDERS)
export class OrdersController {
  constructor(private commandBus: CommandBus) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create New Order',
    description: 'Create new order',
  })
  @ApiBody({ type: CreateOrderDto.Output })
  @ApiZodResponse({
    description: 'Create new order successful',
    type: CreateOrderResponseDto,
  })
  async createCategory(@Body() dto: CreateOrderDto) {
    const result = await this.commandBus.execute(
      new CreateOrderCommand({
        customerId: dto.customerId,
      }),
    );

    return result;
  }
}
