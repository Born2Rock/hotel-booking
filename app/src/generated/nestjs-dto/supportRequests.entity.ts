
import {Users} from './users.entity'
import {ChatMessages} from './chatMessages.entity'


export class SupportRequests {
  id: number ;
user?: Users ;
userId: number ;
createdAt: Date ;
isActive: boolean  | null;
chatMessages?: ChatMessages[] ;
}
