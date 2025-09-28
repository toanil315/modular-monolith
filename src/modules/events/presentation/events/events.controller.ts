import { Body, Controller, Get, Post, Param, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { EVENTS_END_POINT_TAGS } from '../tags';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEventDto, CreateEventResponseDto } from './dtos/create-event.dto';
import { CreateEventCommand } from '../../application/events/create-event/create-event.command';
import { GetEventByIdDto, GetEventResponseDto } from './dtos/get-event.dto';
import { GetEventQuery } from '../../application/events/get-event/get-event.query';
import { CancelEventDto, CancelEventResponseDto } from './dtos/cancel-event.dto';
import { CancelEventCommand } from '../../application/events/cancel-event/cancel-event.command';
import { PublishEventDto, PublishEventResponseDto } from './dtos/publish-event.dto';
import { PublishEventCommand } from '../../application/events/publish-event/publish-event.command';
import { RescheduleEventDto, RescheduleEventResponseDto } from './dtos/reschedule-event.dto';
import { RescheduleEventCommand } from '../../application/events/reschedule-event/reschedule-event.command';
import { SearchEventsDto, SearchEventsResponseDto } from './dtos/search-event.dto';
import { SearchEventsQuery } from '../../application/events/search-event/search-event.query';
import { ApiZodResponse } from 'src/modules/common/presentation/http/api-zod-response.decorator';

@ApiTags(EVENTS_END_POINT_TAGS.EVENTS)
@Controller(EVENTS_END_POINT_TAGS.EVENTS)
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
  @ApiZodResponse({
    description: 'Create Event Successful',
    type: CreateEventResponseDto,
  })
  async createEvent(@Body() dto: CreateEventDto) {
    return this.commandBus.execute(
      new CreateEventCommand({
        categoryId: dto.categoryId,
        title: dto.title,
        description: dto.description,
        location: dto.location,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
      }),
    );
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search Events',
    description: 'Search Published Events',
  })
  @ApiZodResponse({
    description: 'Search Published Event Successfully',
    type: SearchEventsResponseDto,
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

    return searchResult;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Event By ID',
    description: 'Get specific event by ID',
  })
  @ApiZodResponse({
    description: 'Get Event Successful',
    type: GetEventResponseDto,
  })
  async getEvent(@Param() { id }: GetEventByIdDto) {
    const event = await this.queryBus.execute(new GetEventQuery({ eventId: id }));

    return event;
  }

  @Put('publish')
  @ApiOperation({
    summary: 'Publish An Event',
    description: 'Publish specific event',
  })
  @ApiBody({ type: PublishEventDto.Output })
  @ApiZodResponse({
    description: 'Publish Event Successful',
    type: PublishEventResponseDto,
  })
  publishEvent(@Body() dto: PublishEventDto) {
    return this.commandBus.execute(
      new PublishEventCommand({
        id: dto.id,
      }),
    );
  }

  @Put('cancel')
  @ApiOperation({
    summary: 'Cancel An Event',
    description: 'Cancel specific event',
  })
  @ApiBody({ type: CancelEventDto.Output })
  @ApiZodResponse({
    description: 'Cancel Event Successful',
    type: CancelEventResponseDto,
  })
  cancelEvent(@Body() dto: CancelEventDto) {
    return this.commandBus.execute(
      new CancelEventCommand({
        id: dto.id,
      }),
    );
  }

  @Put('reschedule')
  @ApiOperation({
    summary: 'Reschedule An Event',
    description: 'Reschedule specific event',
  })
  @ApiBody({ type: RescheduleEventDto.Output })
  @ApiZodResponse({
    description: 'Reschedule Event Successful',
    type: RescheduleEventResponseDto,
  })
  rescheduleEvent(@Body() dto: RescheduleEventDto) {
    return this.commandBus.execute(
      new RescheduleEventCommand({
        id: dto.id,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
      }),
    );
  }
}
