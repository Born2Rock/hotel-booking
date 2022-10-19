import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUsersDto } from '../generated/nestjs-dto/update-users.dto';
import { Users as UserModel } from '@prisma/client';
import { SearchUserParamsDto } from './dto/search-params-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles-guard';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/api/admin/users/')
  create(@Body() data): Promise<UserModel> {
    return this.usersService.create(data);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/api/admin/users/')
  async findAdminUsers(@Body() params: Partial<SearchUserParamsDto>) {
    const group = 'admin';
    return await this.usersService.findAllForGroup(params, group);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/api/manager/users/')
  async findManagerUsers(@Body() params: Partial<SearchUserParamsDto>) {
    const group = 'manager';
    return await this.usersService.findAllForGroup(params, group);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/users/findById/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usersService.findById(id);
    if (result) {
      const { passwordHash, ...userFields } = result;
      return userFields;
    }
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/users/')
  async findAll(@Body() params: Partial<SearchUserParamsDto>) {
    return await this.usersService.findAll(params);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/users/findByEmail')
  async findByEmail(@Body('email') email: string) {
    const result = await this.usersService.findByEmail(email);
    if (result) {
      const { passwordHash, ...userFields } = result;
      return userFields;
    }
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/users/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUsersDto) {
    const result = await this.usersService.update(id, updateUserDto);
    if (result) {
      const { passwordHash, ...userFields } = result;
      return userFields;
    }
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/users/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
