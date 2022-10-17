import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Users as UserModel } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.UsersCreateInput): Promise<UserModel> {
    return this.prismaService.users.create({
      data,
    });
  }

  async findAll(params): Promise<UserModel[]> {
    const { limit, offset, ...where } = params;
    const pagination = {
      take: undefined,
      skip: 0,
    };
    if (limit) pagination.take = limit;
    if (offset) pagination.skip = offset;
    return await this.prismaService.users.findMany({
      ...pagination,
      where,
    });
  }

  async findAllForGroup(params, forGroup = 'admin'): Promise<UserModel[]> {
    const { limit, offset, ...where } = params;
    const pagination = {
      take: undefined,
      skip: 0,
    };
    if (forGroup === 'manager') {
      where.role = { not: 'admin' };
    }
    if (limit) pagination.take = limit;
    if (offset) pagination.skip = offset;
    return await this.prismaService.users.findMany({
      ...pagination,
      where,
    });
  }

  async findByEmail(email: string): Promise<UserModel> {
    return await this.prismaService.users.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findById(id: number): Promise<UserModel> {
    return await this.prismaService.users.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, body: UpdateUserDto) {
    return this.prismaService.users.update({
      where: {
        id: id,
      },
      data: {
        ...body,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.users.delete({
      where: {
        id: id,
      },
    });
  }
}
