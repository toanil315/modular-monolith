import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { END_POINT_TAGS } from '../tags';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateTicketTypeDto,
  CreateTicketTypeResponseDto,
} from './dtos/create-ticket-type.dto';
import { CreateTicketTypeCommand } from '../../application/ticket-types/create-ticket-type/create-ticket-type.command';
import { ResponseFormatter } from 'src/modules/common/formatters/response.formatter';
import {
  GetTicketTypesDto,
  GetTicketTypesResponseDto,
} from './dtos/get-ticket-types.dto';
import { GetTicketTypesQuery } from '../../application/ticket-types/get-ticket-types/get-ticket-types.query';
import { TicketType } from '../../domain/ticket-types/ticket-type';
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

@ApiTags(END_POINT_TAGS.TICKET_TYPES)
@Controller(END_POINT_TAGS.TICKET_TYPES)
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
  @ApiOkResponse({
    description: 'Create TicketType Successful',
    type: CreateTicketTypeResponseDto.Output,
  })
  async createTicketType(@Body() dto: CreateTicketTypeDto) {
    const { id: ticketTypeId } = await this.commandBus.execute(
      new CreateTicketTypeCommand({
        eventId: dto.eventId,
        name: dto.name,
        price: dto.price,
        currency: dto.currency,
        quantity: dto.quantity,
      }),
    );

    function toDto(ticketTypeId: string): CreateTicketTypeResponseDto {
      return ResponseFormatter.success({
        id: ticketTypeId,
      });
    }

    return toDto(ticketTypeId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Ticket Types',
    description: 'Get all ticket types',
  })
  @ApiOkResponse({
    description: 'Get TicketTypes Successful',
    type: GetTicketTypesResponseDto.Output,
  })
  async getTicketTypes(@Query() dto: GetTicketTypesDto) {
    const categories = await this.queryBus.execute(
      new GetTicketTypesQuery({ eventId: dto.eventId }),
    );

    function toDto(ticketTypes: TicketType[]): GetTicketTypesResponseDto {
      return ResponseFormatter.success(
        ticketTypes.map((ticketType) => ({
          id: ticketType.id,
          eventId: ticketType.eventId,
          name: ticketType.name,
          price: ticketType.price,
          currency: ticketType.currency,
          quantity: ticketType.quantity,
        })),
      );
    }

    return toDto(categories);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Ticket Type By ID',
    description: 'Get specific ticket type by ID',
  })
  @ApiOkResponse({
    description: 'Get TicketType Successful',
    type: GetTicketTypeResponseDto.Output,
  })
  async getTicketType(@Param() dto: GetTicketTypeByIdDto) {
    const ticketType = await this.queryBus.execute(
      new GetTicketTypeQuery({ id: dto.id }),
    );

    function toDto(ticketType: TicketType): GetTicketTypeResponseDto {
      return ResponseFormatter.success({
        id: ticketType.id,
        eventId: ticketType.eventId,
        name: ticketType.name,
        price: ticketType.price,
        currency: ticketType.currency,
        quantity: ticketType.quantity,
      });
    }

    return toDto(ticketType);
  }

  @Put('update-price')
  @ApiOperation({
    summary: 'Update Ticket Type Price',
    description: 'Update price of ticket type',
  })
  @ApiBody({ type: UpdateTicketTypePriceDto.Output })
  @ApiOkResponse({
    description: 'Update TicketType Successful',
    type: UpdateTicketTypePriceResponseDto.Output,
  })
  async updateTicketType(@Body() dto: UpdateTicketTypePriceDto) {
    await this.commandBus.execute(
      new UpdateTicketTypePriceCommand({
        id: dto.id,
        price: dto.price,
      }),
    );

    return ResponseFormatter.success(null);
  }
}
