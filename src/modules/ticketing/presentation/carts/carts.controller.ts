import { Body, Controller, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ApiZodResponse } from 'src/modules/common/presentation/abstractions/api-zod-response.decorator';
import { TICKETING_END_POINT_TAGS } from '../tags';
import { AddToCartDto, AddToCartResponseDto } from './dtos/add-to-cart.dto';
import { AddToCartCommand } from '../../application/carts/add-to-cart/add-to-cart.command';

@ApiTags(TICKETING_END_POINT_TAGS.CARTS)
@Controller(TICKETING_END_POINT_TAGS.CARTS)
export class CartsController {
  constructor(private commandBus: CommandBus) {}

  @Put('/add')
  @ApiOperation({
    summary: 'Add To Cart',
    description: 'Add new item to cart',
  })
  @ApiBody({ type: AddToCartDto.Output })
  @ApiZodResponse({
    description: 'Add To Cart Successful',
    type: AddToCartResponseDto,
  })
  async createCategory(@Body() dto: AddToCartDto) {
    const categoryId = await this.commandBus.execute(
      new AddToCartCommand({
        customerId: dto.customerId,
        ticketTypeId: dto.ticketTypeId,
        quantity: dto.quantity,
      }),
    );

    return categoryId;
  }
}
