import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';
import { CreateEventDto, EventResponseDto } from './event.dto';
import { ResponseFormatter } from 'src/modules/common/formatters/response.formatter';
import { EventNotFoundException } from './event.exception';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event, EVENTS_CONNECTION_NAME)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async createEvent(dto: CreateEventDto): Promise<EventResponseDto> {
    const event = this.eventsRepository.create(dto);
    const saved = await this.eventsRepository.save(event);

    return ResponseFormatter.success(this.fromEntityToDto(event));
  }

  async getEvent(id: string): Promise<EventResponseDto> {
    const event = await this.eventsRepository.findOne({ where: { id } });

    if (!event) {
      throw new EventNotFoundException(id);
    }

    return ResponseFormatter.success(this.fromEntityToDto(event));
  }

  private fromEntityToDto(event: Event) {
    return {
      ...event,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }
}
