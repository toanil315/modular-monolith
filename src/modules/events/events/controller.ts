import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { END_POINT_TAGS } from '../tags';
import { EventsService } from './service';
import { CreateEventDto, EventResponseDto, GetEventByIdDto } from './event.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags(END_POINT_TAGS.EVENTS)
@Controller(END_POINT_TAGS.EVENTS)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Event',
    description: 'New event creation entry',
  })
  @ApiBody({ type: CreateEventDto.Output })
  @ApiOkResponse({
    description: 'Create Event Successful',
    type: EventResponseDto.Output,
  })
  async createEvent(@Body() dto: CreateEventDto) {
    return this.eventsService.createEvent(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Event By ID',
    description: 'Get specific event by ID',
  })
  @ApiOkResponse({
    description: 'Get Event Successful',
    type: EventResponseDto.Output,
  })
  async getEvent(@Param() { id }: GetEventByIdDto) {
    return this.eventsService.getEvent(id);
  }
}
