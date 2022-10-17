
import {Hotels} from './hotels.entity'
import {HotelRoomsImages} from './hotelRoomsImages.entity'
import {Reservations} from './reservations.entity'


export class HotelRooms {
  id: number ;
description: string  | null;
createdAt: Date ;
updatedAt: Date ;
isEnabled: boolean ;
hotel?: Hotels ;
hotelId: number ;
images?: HotelRoomsImages[] ;
reservations?: Reservations[] ;
}
