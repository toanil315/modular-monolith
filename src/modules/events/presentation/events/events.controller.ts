import { Body, Controller, Get, Post, Param } from '@nestjs/common';
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
        description: event.description,
        location: event.location,
        title: event.title,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
      });
    }

    return toDto(event);
  }
}
