import { Body, Controller, Get, Post, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { USERS_END_POINT_TAGS } from '../tags';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserDto, RegisterUserResponseDto } from './dtos/register-user.dto';
import { ApiZodResponse } from 'src/modules/common/presentation/abstractions/api-zod-response.decorator';
import { RegisterUserCommand } from '../../application/users/register-user/register-user.command';
import { GetUserByIdDto, GetUserByIdResponseDto } from './dtos/get-user.dto';
import { GetUserQuery } from '../../application/users/get-user/get-user.query';
import { UpdateUserProfileDto, UpdateUserProfileResponseDto } from './dtos/update-user-profile.dto';
import { UpdateUserProfileCommand } from '../../application/users/update-user-profile/update-user-profile.command';
import { Public } from 'nest-keycloak-connect';

@ApiTags(USERS_END_POINT_TAGS.USERS)
@Controller(USERS_END_POINT_TAGS.USERS)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @Public()
  @ApiOperation({
    summary: 'Register User',
    description: 'New user registration entry',
  })
  @ApiBody({ type: RegisterUserDto.Output })
  @ApiZodResponse({
    description: 'Register User Successful',
    type: RegisterUserResponseDto,
  })
  registerUser(@Body() dto: RegisterUserDto) {
    return this.commandBus.execute(
      new RegisterUserCommand({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: dto.password,
      }),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get User By ID',
    description: 'Get specific user by ID',
  })
  @ApiZodResponse({
    description: 'Get User Successful',
    type: GetUserByIdResponseDto,
  })
  getCategory(@Param() { id }: GetUserByIdDto) {
    return this.queryBus.execute(new GetUserQuery({ id }));
  }

  @Put(':id/profile')
  @ApiOperation({
    summary: 'Update User Profile',
    description: 'Update user profile',
  })
  @ApiBody({ type: UpdateUserProfileDto.Output })
  @ApiZodResponse({
    description: 'Update User Profile Successful',
    type: UpdateUserProfileResponseDto,
  })
  updateCategory(@Body() dto: UpdateUserProfileDto) {
    return this.commandBus.execute(
      new UpdateUserProfileCommand({
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
      }),
    );
  }
}
