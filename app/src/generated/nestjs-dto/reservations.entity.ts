
import {Users} from './users.entity'
import {Hotels} from './hotels.entity'
import {HotelRooms} from './hotelRooms.entity'


export class Reservations {
  id: number ;
user?: Users ;
userId: number ;
hotel?: Hotels ;
hotelId: number ;
hotelRoom?: HotelRooms ;
hotelRoomId: number ;
dateStart: Date ;
dateEnd: Date ;
}
