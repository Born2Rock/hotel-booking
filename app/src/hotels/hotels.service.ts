import { Body, Get, Injectable } from '@nestjs/common';
import { Hotels as Hotel } from '../generated/nestjs-dto/hotels.entity';
import { Prisma, Hotels as hotelModel } from '@prisma/client';
import { PrismaService } from '../prisma.service';

import { HotelRooms } from '../generated/nestjs-dto/hotelRooms.entity';
import { map } from 'rxjs';

@Injectable()
export class HotelsService {
  constructor(private prismaService: PrismaService) {}

  async createHotelRoom(hotelId, fields, images): Promise<Partial<HotelRooms>> {
    const payload = {
      description: fields.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hotelId,
      images: {},
    };

    if (images?.length) {
      images = images.map((i) => {
        return {
          image: i.path,
        };
      });

      payload.images = {
        create: images,
      };
    }

    const hotel = await this.prismaService.hotels.findUnique({
      where: {
        id: hotelId,
      },
    });

    const hotelRoom = await this.prismaService.hotelRooms.create({
      data: payload,
      select: {
        id: true,
        description: true,
        createdAt: false,
        updatedAt: false,
        isEnabled: true,
        hotelId: true,
        //hotel: true,
        images: true,
      },
    });

    const result = {
      ...hotelRoom,
      hotel,
    };

    return result;
  }
  async editHotelRoom(
    roomId,
    hotelId,
    fields,
    images,
  ): Promise<Partial<HotelRooms>> {
    const payload = {
      description: fields.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hotelId,
      images: {},
    };

    if (images?.length) {
      images = images.map((i) => {
        return {
          image: i.path,
        };
      });
      payload.images = {
        deleteMany: {},
        create: images,
      };
    }

    const hotel = await this.prismaService.hotels.findUnique({
      where: { id: hotelId },
    });

    const hotelRoom = await this.prismaService.hotelRooms.update({
      where: { id: roomId },
      data: payload,
      include: {
        images: true,
      },
    });

    const result = {
      ...hotelRoom,
      hotel,
    };

    return result;
  }

  async getHotelRoom(id): Promise<HotelRooms> {
    return await this.prismaService.hotelRooms.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });
  }

  async createHotel(payload): Promise<Partial<Hotel>> {
    payload = {
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await this.prismaService.hotels.create({
      data: payload,
    });
    const { createdAt, updatedAt, userId, ...filteredResult } = result;
    return filteredResult;
  }

  async editHotel(payload, hotelId): Promise<Partial<Hotel>> {
    const result = await this.prismaService.hotels.update({
      data: payload,
      where: {
        id: hotelId,
      },
    });
    console.log(result);
    return result;
  }

  async findHotels(params): Promise<HotelRooms[]> {
    const { limit, offset, ...where } = params;
    const pagination = {
      take: undefined,
      skip: 0,
    };
    if (limit) pagination.take = limit;
    if (offset) pagination.skip = offset;
    return await this.prismaService.hotelRooms.findMany({
      ...pagination,
      where,
    });
  }

  async findHotelRooms(params): Promise<hotelModel[]> {
    const { limit, offset, ...where } = params;
    const pagination = {
      take: undefined,
      skip: 0,
    };
    if (limit) pagination.take = limit;
    if (offset) pagination.skip = offset;
    return await this.prismaService.hotels.findMany({
      ...pagination,
      where,
    });
  }

  async create(data: Prisma.HotelsCreateInput) {
    return this.prismaService.hotels.create({
      data,
    });
  }

  findAll() {
    return `This action returns all hotels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hotel`;
  }

  // update(id: number, updateHotelDto: UpdateHotelDto) {
  //   return `This action updates a #${id} hotel`;
  // }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
