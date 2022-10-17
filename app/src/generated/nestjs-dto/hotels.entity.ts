
import {Users} from './users.entity'
import {HotelRooms} from './hotelRooms.entity'
import {Reservations} from './reservations.entity'


export class Hotels {
  id: number ;
title: string ;
description: string  | null;
createdAt: Date ;
updatedAt: Date ;
user?: Users ;
userId: number ;
hotelRooms?: HotelRooms[] ;
reservations?: Reservations[] ;
}
