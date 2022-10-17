
import {Role} from '@prisma/client'
import {Hotels} from './hotels.entity'
import {Reservations} from './reservations.entity'
import {SupportRequests} from './supportRequests.entity'
import {ChatMessages} from './chatMessages.entity'


export class Users {
  id: number ;
email: string ;
passwordHash: string ;
name: string ;
contactPhone: string  | null;
role: Role ;
hotels?: Hotels[] ;
reservations?: Reservations[] ;
supportRequests?: SupportRequests[] ;
chatMessages?: ChatMessages[] ;
}
