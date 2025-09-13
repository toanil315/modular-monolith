import { Body, Controller, Get, Post, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { END_POINT_TAGS } from '../tags';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ResponseFormatter } from 'src/modules/common/formatters/response.formatter';
import { CreateCategoryCommand } from '../../application/categories/create-category/create-category.command';
import {
  CreateCategoryDto,
  CreateCategoryResponseDto,
} from './dtos/create-category.dto';

import { GetCategoryQuery } from '../../application/categories/get-category/get-category.query';
import { Category } from '../../domain/categories/category';
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
  @ApiOkResponse({
    description: 'Create Category Successful',
    type: CreateCategoryResponseDto.Output,
  })
  async createCategory(@Body() dto: CreateCategoryDto) {
    const { id: categoryId } = await this.commandBus.execute(
      new CreateCategoryCommand({
        name: dto.name,
      }),
    );

    function toDto(categoryId: string): CreateCategoryResponseDto {
      return ResponseFormatter.success({
        id: categoryId,
      });
    }

    return toDto(categoryId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Categories',
    description: 'Get all categories',
  })
  @ApiOkResponse({
    description: 'Get Categories Successful',
    type: GetCategoriesResponseDto.Output,
  })
  async getCategories() {
    const categories = await this.queryBus.execute(new GetCategoriesQuery());

    function toDto(categories: Category[]): GetCategoriesResponseDto {
      return ResponseFormatter.success(
        categories.map((category) => ({
          id: category.id,
          name: category.name,
          isArchived: category.isArchived,
        })),
      );
    }

    return toDto(categories);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Category By ID',
    description: 'Get specific category by ID',
  })
  @ApiOkResponse({
    description: 'Get Category Successful',
    type: GetCategoryResponseDto.Output,
  })
  async getCategory(@Param() { id }: GetCategoryByIdDto) {
    const category = await this.queryBus.execute(
      new GetCategoryQuery({ categoryId: id }),
    );

    function toDto(category: Category): GetCategoryResponseDto {
      return ResponseFormatter.success({
        id: category.id,
        name: category.name,
        isArchived: category.isArchived,
      });
    }

    return toDto(category);
  }

  @Put('update')
  @ApiOperation({
    summary: 'Update Category',
    description: 'Update name of category',
  })
  @ApiBody({ type: UpdateCategoryDto.Output })
  @ApiOkResponse({
    description: 'Update Category Successful',
    type: UpdateCategoryResponseDto.Output,
  })
  async updateCategory(@Body() dto: UpdateCategoryDto) {
    await this.commandBus.execute(
      new UpdateCategoryCommand({
        id: dto.id,
        name: dto.name,
      }),
    );

    return ResponseFormatter.success(null);
  }

  @Put('archive')
  @ApiOperation({
    summary: 'Archive Category',
    description: 'Archive specific category',
  })
  @ApiBody({ type: ArchiveCategoryDto.Output })
  @ApiOkResponse({
    description: 'Archive Category Successful',
    type: ArchiveCategoryResponseDto.Output,
  })
  async archiveCategory(@Body() dto: ArchiveCategoryDto) {
    await this.commandBus.execute(
      new ArchiveCategoryCommand({
        id: dto.id,
      }),
    );

    return ResponseFormatter.success(null);
  }
}
