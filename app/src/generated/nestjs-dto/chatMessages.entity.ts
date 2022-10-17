
import {SupportRequests} from './supportRequests.entity'
import {Users} from './users.entity'


export class ChatMessages {
  id: number ;
text: string ;
sentAt: Date ;
readAt: Date  | null;
supportRequest?: SupportRequests ;
supportRequestId: number ;
user?: Users ;
userId: number ;
}
