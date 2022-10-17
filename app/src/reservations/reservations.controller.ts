import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
//import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles-guard';

@Controller('')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/api/client/reservations')
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    const { userId } = req.user;
    return this.reservationsService.createReservation(
      createReservationDto,
      userId,
    );
  }

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/api/client/reservations')
  getCurrentClientReservations(@Request() req) {
    const { userId } = req.user;
    return this.reservationsService.getClientReservations(userId);
  }

  @Roles('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/api/client/reservations/:id')
  getClientReservationsByUserId(@Param('id', ParseIntPipe) userId) {
    return this.reservationsService.getClientReservations(userId);
  }

  @Roles('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/api/manager/reservations/:userId/:reservationId')
  deleteReservationById(@Param(ParseIntPipe) params) {
    const { userId, reservationId } = params;
    return this.reservationsService.deleteReservationById(
      userId,
      reservationId,
    );
  }
}
