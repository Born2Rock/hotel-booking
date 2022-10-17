import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PrismaService } from '../prisma.service';
import { ReservationDto } from './dto/reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prismaService: PrismaService) {}

  async createReservation(
    data: CreateReservationDto,
    userId: number,
  ): Promise<ReservationDto | HttpException> {
    const { hotelId } = await this.prismaService.hotelRooms.findFirst({
      where: {
        id: data.hotelRoom,
      },
    });

    const hotelRoomId = data.hotelRoom;

    const createPayload = {
      userId,
      hotelId,
      hotelRoomId,
      dateStart: data.startDate,
      dateEnd: data.endDate,
    };

    const hotelRoom = await this.prismaService.hotelRooms.findUnique({
      where: {
        id: hotelRoomId,
      },
    });

    if (!hotelRoom?.isEnabled) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }

    const result = await this.prismaService.reservations.create({
      data: createPayload,
      select: {
        dateStart: true,
        dateEnd: true,
        hotel: {
          select: {
            title: true,
            description: true,
          },
        },
        hotelRoom: {
          select: {
            description: true,
            images: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });
    return result;
  }

  async getClientReservations(userId: number): Promise<ReservationDto[]> {
    const result = await this.prismaService.reservations.findMany({
      where: {
        userId,
      },
      select: {
        dateStart: true,
        dateEnd: true,
        hotel: {
          select: {
            title: true,
            description: true,
          },
        },
        hotelRoom: {
          select: {
            description: true,
            images: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });
    return result;
  }

  async deleteReservationById(
    userId: number,
    reservationId: number,
  ): Promise<any> {
    const result = await this.prismaService.reservations.deleteMany({
      where: {
        id: reservationId,
        userId: userId,
      },
    });

    return result;
  }
}
