import { HotelRooms as HotelRoom } from '../../generated/nestjs-dto/hotelRooms.entity';
import { SearchRoomsParams } from './SearchRoomsParams';

export interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: number, isEnabled?: true): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: number, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
