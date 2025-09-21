import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EVENTS_END_POINT_TAGS } from '../tags';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateTicketTypeDto,
  CreateTicketTypeResponseDto,
} from './dtos/create-ticket-type.dto';
import { CreateTicketTypeCommand } from '../../application/ticket-types/create-ticket-type/create-ticket-type.command';
import {
  GetTicketTypesDto,
  GetTicketTypesResponseDto,
} from './dtos/get-ticket-types.dto';
import { GetTicketTypesQuery } from '../../application/ticket-types/get-ticket-types/get-ticket-types.query';
import {
  GetTicketTypeByIdDto,
  GetTicketTypeResponseDto,
} from './dtos/get-ticket-type.dto';
import { GetTicketTypeQuery } from '../../application/ticket-types/get-ticket-type/get-ticket-type.query';
import {
  UpdateTicketTypePriceDto,
  UpdateTicketTypePriceResponseDto,
} from './dtos/update-ticket-type-price.dto';
import { UpdateTicketTypePriceCommand } from '../../application/ticket-types/update-ticket-type-price/update-ticket-type-price.command';
import { ApiZodResponse } from 'src/modules/common/presentation/http/api-zod-response.decorator';

@ApiTags(EVENTS_END_POINT_TAGS.TICKET_TYPES)
@Controller(EVENTS_END_POINT_TAGS.TICKET_TYPES)
export class TicketTypesController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Ticket Type',
    description: 'New ticket type creation entry',
  })
  @ApiBody({ type: CreateTicketTypeDto.Output })
  @ApiZodResponse({
    description: 'Create TicketType Successful',
    type: CreateTicketTypeResponseDto,
  })
  async createTicketType(@Body() dto: CreateTicketTypeDto) {
    const ticketTypeId = await this.commandBus.execute(
      new CreateTicketTypeCommand({
        eventId: dto.eventId,
        name: dto.name,
        price: dto.price,
        currency: dto.currency,
        quantity: dto.quantity,
      }),
    );

    return ticketTypeId;
  }

  @Get()
  @ApiOperation({
    summary: 'Get Ticket Types',
    description: 'Get all ticket types',
  })
  @ApiZodResponse({
    description: 'Get TicketTypes Successful',
    type: GetTicketTypesResponseDto,
  })
  async getTicketTypes(@Query() dto: GetTicketTypesDto) {
    const categories = await this.queryBus.execute(
      new GetTicketTypesQuery({ eventId: dto.eventId }),
    );

    return categories;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Ticket Type By ID',
    description: 'Get specific ticket type by ID',
  })
  @ApiZodResponse({
    description: 'Get TicketType Successful',
    type: GetTicketTypeResponseDto,
  })
  async getTicketType(@Param() dto: GetTicketTypeByIdDto) {
    const ticketType = await this.queryBus.execute(
      new GetTicketTypeQuery({ id: dto.id }),
    );

    return ticketType;
  }

  @Put('update-price')
  @ApiOperation({
    summary: 'Update Ticket Type Price',
    description: 'Update price of ticket type',
  })
  @ApiBody({ type: UpdateTicketTypePriceDto.Output })
  @ApiZodResponse({
    description: 'Update TicketType Successful',
    type: UpdateTicketTypePriceResponseDto,
  })
  updateTicketType(@Body() dto: UpdateTicketTypePriceDto) {
    return this.commandBus.execute(
      new UpdateTicketTypePriceCommand({
        id: dto.id,
        price: dto.price,
      }),
    );
  }
}
