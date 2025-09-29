import { Body, Controller, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ApiZodResponse } from 'src/modules/common/presentation/http/api-zod-response.decorator';
import { TICKETING_END_POINT_TAGS } from '../tags';
import { RefundDto, RefundResponseDto } from './dtos/refund.dto';
import { RefundCommand } from '../../application/payments/refund/refund-command';

@ApiTags(TICKETING_END_POINT_TAGS.PAYMENTS)
@Controller(TICKETING_END_POINT_TAGS.PAYMENTS)
export class PaymentsController {
  constructor(private commandBus: CommandBus) {}

  @Put('/refund')
  @ApiOperation({
    summary: 'Refund',
    description: 'Refund',
  })
  @ApiBody({ type: RefundDto.Output })
  @ApiZodResponse({
    description: 'Refund successful',
    type: RefundResponseDto,
  })
  async createCategory(@Body() dto: RefundDto) {
    const result = await this.commandBus.execute(
      new RefundCommand({
        paymentId: dto.paymentId,
        amount: dto.amount,
      }),
    );

    return result;
  }
}
