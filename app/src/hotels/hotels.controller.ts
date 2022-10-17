import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { SearchParamsHotelsDto } from './dto/search-params-hotels.dto';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../shared/files';
import { SearchParamsHotelRoomsDto } from './dto/search-params-hotel-rooms.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles-guard';

@Controller('')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  /*
   *  [x] 2.1.6. Добавление номера POST /api/admin/hotel-rooms/
   *  [x] 2.1.2. Информация о конкретном номере GET /api/common/hotel-rooms/:id
   *  [x] 2.1.7. Изменение описания номера PUT /api/admin/hotel-rooms/:id
   *  [X] 2.1.1. Поиск номеров GET /api/common/hotel-rooms
   * */

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/api/admin/hotel-rooms/')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './files/hotelRooms',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createHotelRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body('hotelId', ParseIntPipe) hotelId: number,
    @Body() fields: CreateHotelRoomDto,
  ) {
    return await this.hotelsService.createHotelRoom(hotelId, fields, images);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/api/admin/hotel-rooms/:id')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './files/hotelRooms',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async editHotelRoom(
    @Param('id', ParseIntPipe) roomId: number,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body('hotelId', ParseIntPipe) hotelId: number,
    @Body() fields: CreateHotelRoomDto,
  ) {
    return await this.hotelsService.editHotelRoom(
      roomId,
      hotelId,
      fields,
      images,
    );
  }

  @Get('/api/common/hotel-rooms/:id')
  async getHotelRoom(@Param('id', ParseIntPipe) id: number) {
    return await this.hotelsService.getHotelRoom(id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/api/admin/hotel-rooms/')
  async findHotelRooms(@Body() params: SearchParamsHotelsDto) {
    return await this.hotelsService.findHotelRooms(params);
  }

  /*
   *  [x] 2.1.3. Добавление гостиницы POST /api/admin/hotels/
   *  [x] 2.1.4. Получение списка гостиниц GET /api/admin/hotels/
   *  [x] 2.1.5. Изменение описания гостиницы PUT /api/admin/hotels/:id
   * */

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/api/admin/hotels/')
  async findAll(@Body() params: SearchParamsHotelRoomsDto) {
    return await this.hotelsService.findHotels(params);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/api/admin/hotels/')
  async createHotel(@Request() req, @Body() params: CreateHotelDto) {
    const { userId } = req.user;
    const payload = {
      ...params,
      userId: userId,
    };
    return await this.hotelsService.createHotel(payload);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/api/admin/hotels/:id')
  async editHotel(
    @Param('id', ParseIntPipe) id: number,
    @Body() params: Partial<CreateHotelDto>,
  ) {
    return await this.hotelsService.editHotel(params, id);
  }
}
