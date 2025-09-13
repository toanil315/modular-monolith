import { Body, Controller, Get, Post, Param, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { END_POINT_TAGS } from '../tags';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateEventDto,
  CreateEventResponseDto,
} from './dtos/create-event.dto';
import { CreateEventCommand } from '../../application/events/create-event/create-event.command';
import { GetEventByIdDto, GetEventResponseDto } from './dtos/get-event.dto';
import { GetEventQuery } from '../../application/events/get-event/get-event.query';
import { ResponseFormatter } from 'src/modules/common/formatters/response.formatter';
import { Event } from '../../domain/events/event';
import {
  CancelEventDto,
  CancelEventResponseDto,
} from './dtos/cancel-event.dto';
import { CancelEventCommand } from '../../application/events/cancel-event/cancel-event.command';
import {
  PublishEventDto,
  PublishEventResponseDto,
} from './dtos/publish-event.dto';
import { PublishEventCommand } from '../../application/events/publish-event/publish-event.command';
import {
  RescheduleEventDto,
  RescheduleEventResponseDto,
} from './dtos/reschedule-event.dto';
import { RescheduleEventCommand } from '../../application/events/reschedule-event/reschedule-event.command';
import {
  SearchEventsDto,
  SearchEventsResponseDto,
} from './dtos/search-event.dto';
import {
  SearchEventReturn,
  SearchEventsQuery,
} from '../../application/events/search-event/search-event.query';

@ApiTags(END_POINT_TAGS.EVENTS)
@Controller(END_POINT_TAGS.EVENTS)
export class EventsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Event',
    description: 'New event creation entry',
  })
  @ApiBody({ type: CreateEventDto.Output })
  @ApiOkResponse({
    description: 'Create Event Successful',
    type: CreateEventResponseDto.Output,
  })
  async createEvent(@Body() dto: CreateEventDto) {
    const { id: eventId } = await this.commandBus.execute(
      new CreateEventCommand({
        categoryId: dto.categoryId,
        title: dto.title,
        description: dto.description,
        location: dto.location,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
      }),
    );

    function toDto(eventId: string): CreateEventResponseDto {
      return ResponseFormatter.success({
        id: eventId,
      });
    }

    return toDto(eventId);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search Events',
    description: 'Search Published Events',
  })
  @ApiOkResponse({
    description: 'Search Published Event Successfully',
    type: SearchEventsResponseDto.Output,
  })
  async searchPublishedEvent(@Query() dto: SearchEventsDto) {
    const searchResult = await this.queryBus.execute(
      new SearchEventsQuery({
        page: dto.page,
        size: dto.size,
        categoryId: dto.categoryId,
        startsAt: dto.startsAt,
        endsAt: dto.startsAt,
      }),
    );

    function toDto(searchResult: SearchEventReturn): SearchEventsResponseDto {
      return ResponseFormatter.success({
        page: searchResult.page,
        size: searchResult.size,
        totalCount: searchResult.totalCount,
        records: searchResult.records.map((record) => ({
          id: record.id,
          categoryId: record.categoryId,
          description: record.description,
          status: record.status,
          location: record.location,

          title: record.title,
          startsAt: record.startsAt,
          endsAt: record.endsAt,
        })),
      });
    }

    return toDto(searchResult);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Event By ID',
    description: 'Get specific event by ID',
  })
  @ApiOkResponse({
    description: 'Get Event Successful',
    type: GetEventResponseDto.Output,
  })
  async getEvent(@Param() { id }: GetEventByIdDto) {
    const event = await this.queryBus.execute(
      new GetEventQuery({ eventId: id }),
    );

    function toDto(event: Event): GetEventResponseDto {
      return ResponseFormatter.success({
        id: event.id,
        categoryId: event.categoryId,
        description: event.description,
        location: event.location,

        title: event.title,
        startsAt: event.startsAt,
        endsAt: event.endsAt,

        ticketTypes: event.ticketTypes.map((ticketType) => ({
          id: ticketType.id,
          eventId: ticketType.eventId,
          name: ticketType.name,
          price: ticketType.price,
          currency: ticketType.currency,
          quantity: ticketType.quantity,
        })),
      });
    }

    return toDto(event);
  }

  @Put('publish')
  @ApiOperation({
    summary: 'Publish An Event',
    description: 'Publish specific event',
  })
  @ApiBody({ type: PublishEventDto.Output })
  @ApiOkResponse({
    description: 'Publish Event Successful',
    type: PublishEventResponseDto.Output,
  })
  async publishEvent(@Body() dto: PublishEventDto) {
    await this.commandBus.execute(
      new PublishEventCommand({
        id: dto.id,
      }),
    );

    return ResponseFormatter.success(null);
  }

  @Put('cancel')
  @ApiOperation({
    summary: 'Cancel An Event',
    description: 'Cancel specific event',
  })
  @ApiBody({ type: CancelEventDto.Output })
  @ApiOkResponse({
    description: 'Cancel Event Successful',
    type: CancelEventResponseDto.Output,
  })
  async cancelEvent(@Body() dto: CancelEventDto) {
    await this.commandBus.execute(
      new CancelEventCommand({
        id: dto.id,
      }),
    );

    return ResponseFormatter.success(null);
  }

  @Put('reschedule')
  @ApiOperation({
    summary: 'Reschedule An Event',
    description: 'Reschedule specific event',
  })
  @ApiBody({ type: RescheduleEventDto.Output })
  @ApiOkResponse({
    description: 'Reschedule Event Successful',
    type: RescheduleEventResponseDto.Output,
  })
  async rescheduleEvent(@Body() dto: RescheduleEventDto) {
    await this.commandBus.execute(
      new RescheduleEventCommand({
        id: dto.id,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
      }),
    );

    return ResponseFormatter.success(null);
  }
}
