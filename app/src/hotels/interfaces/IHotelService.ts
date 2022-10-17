import { Hotels as Hotel } from '../../generated/nestjs-dto/hotels.entity';

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: number): Promise<Hotel>;
  search(params: Pick<Hotel, 'title'>): Promise<Hotel[]>;
}
