import { Body, Controller, Get, Post, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { END_POINT_TAGS } from '../tags';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCategoryCommand } from '../../application/categories/create-category/create-category.command';
import {
  CreateCategoryDto,
  CreateCategoryResponseDto,
} from './dtos/create-category.dto';

import { GetCategoryQuery } from '../../application/categories/get-category/get-category.query';
import { GetCategoriesResponseDto } from './dtos/get-categories.dto';
import { GetCategoriesQuery } from '../../application/categories/get-categories/get-categories.query';
import {
  UpdateCategoryDto,
  UpdateCategoryResponseDto,
} from './dtos/update-category.dto';
import { UpdateCategoryCommand } from '../../application/categories/update-category/update-category.command';
import {
  ArchiveCategoryDto,
  ArchiveCategoryResponseDto,
} from './dtos/archive-category.dto';
import { ArchiveCategoryCommand } from '../../application/categories/archive-category/archive-category.command';
import {
  GetCategoryByIdDto,
  GetCategoryResponseDto,
} from './dtos/get-category.dto';
import { ApiZodResponse } from 'src/modules/common/presentation/http/api-zod-response.decorator';

@ApiTags(END_POINT_TAGS.CATEGORIES)
@Controller(END_POINT_TAGS.CATEGORIES)
export class CategoriesController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Category',
    description: 'New category creation entry',
  })
  @ApiBody({ type: CreateCategoryDto.Output })
  @ApiZodResponse({
    description: 'Create Category Successful',
    type: CreateCategoryResponseDto,
  })
  async createCategory(@Body() dto: CreateCategoryDto) {
    const categoryId = await this.commandBus.execute(
      new CreateCategoryCommand({
        name: dto.name,
      }),
    );

    return categoryId;
  }

  @Get()
  @ApiOperation({
    summary: 'Get Categories',
    description: 'Get all categories',
  })
  @ApiZodResponse({
    description: 'Get Categories Successful',
    type: GetCategoriesResponseDto,
  })
  async getCategories() {
    const categories = await this.queryBus.execute(new GetCategoriesQuery());
    return categories;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Category By ID',
    description: 'Get specific category by ID',
  })
  @ApiZodResponse({
    description: 'Get Category Successful',
    type: GetCategoryResponseDto,
  })
  async getCategory(@Param() { id }: GetCategoryByIdDto) {
    const category = await this.queryBus.execute(
      new GetCategoryQuery({ categoryId: id }),
    );

    return category;
  }

  @Put('update')
  @ApiOperation({
    summary: 'Update Category',
    description: 'Update name of category',
  })
  @ApiBody({ type: UpdateCategoryDto.Output })
  @ApiZodResponse({
    description: 'Update Category Successful',
    type: UpdateCategoryResponseDto,
  })
  updateCategory(@Body() dto: UpdateCategoryDto) {
    return this.commandBus.execute(
      new UpdateCategoryCommand({
        id: dto.id,
        name: dto.name,
      }),
    );
  }

  @Put('archive')
  @ApiOperation({
    summary: 'Archive Category',
    description: 'Archive specific category',
  })
  @ApiBody({ type: ArchiveCategoryDto.Output })
  @ApiZodResponse({
    description: 'Archive Category Successful',
    type: ArchiveCategoryResponseDto,
  })
  archiveCategory(@Body() dto: ArchiveCategoryDto) {
    return this.commandBus.execute(
      new ArchiveCategoryCommand({
        id: dto.id,
      }),
    );
  }
}
