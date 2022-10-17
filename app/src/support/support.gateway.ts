import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Request } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SupportGateway {
  @WebSocketServer() server: Server;

  userToSocketClientsMap = {};
  chatIdToUsersSubscriptions = {};

  invalidClientCredentials(data) {
    const { token, userId } = data;
    return !userId || !token || !this.isValidToken(token);
  }

  isValidToken(token) {
    //TODO: JWT token validation here
    return true;
  }

  userIsSubscribedToChatUpdates(userId, chatId) {
    if (!this.chatIdToUsersSubscriptions[chatId]) return false;
    if (typeof this.chatIdToUsersSubscriptions[chatId] !== 'object')
      return false;
    if (!this.chatIdToUsersSubscriptions[chatId].has(userId)) return false;
    return true;
  }

  @SubscribeMessage('checkToken')
  checkToken(
    @Request() req,
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ): object {
    if (this.invalidClientCredentials(data)) {
      return { valid: false };
    }
    const { userId } = data;
    this.userToSocketClientsMap[userId] = client;
    return { valid: true };
  }

  @SubscribeMessage('subscribeToChat')
  handleEvent(
    @Request() req,
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ): object {
    if (this.invalidClientCredentials(data)) return { success: false };
    const { userId, chatId } = data;
    if (!this.chatIdToUsersSubscriptions[chatId]) {
      this.chatIdToUsersSubscriptions[chatId] = new Set().add(userId);
    } else {
      this.chatIdToUsersSubscriptions[chatId].add(userId);
    }
    return { success: true };
  }

  @OnEvent('support.InformAboutNewMessage')
  listenToEvent(payload) {
    const { userId, chatId, text } = payload;
    const client = this.userToSocketClientsMap[userId];
    if (!this.userIsSubscribedToChatUpdates(userId, chatId)) return;
    try {
      client.emit('newChatMessage', { chatId, text });
    } catch (e) {
      console.log(e);
    }
  }
}
