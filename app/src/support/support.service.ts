import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SearchParamsSupportRequestsDto } from './dto/search-params-support-requests.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SupportService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createSupportRequest(userId: number, text: string) {
    const data = {
      userId,
      createdAt: new Date().toISOString(),
      isActive: true,
      chatMessages: {
        create: [
          {
            text,
            sentAt: new Date().toISOString(),
            userId,
          },
        ],
      },
    };
    const result = await this.prismaService.supportRequests.create({
      data: data,
    });
    return result;
  }
  async getUserSupportRequests(
    params: SearchParamsSupportRequestsDto,
    userId?: number,
    userDetails?: boolean,
  ) {
    const { limit, offset, isActive } = params;

    const pagination = {
      take: undefined,
      skip: 0,
    };
    if (limit) pagination.take = limit;
    if (offset) pagination.skip = offset;

    const where = {
      isActive,
      userId,
    };

    let includeSubQueries;

    if (userDetails) {
      includeSubQueries = {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contactPhone: true,
            },
          },
        },
      };
    }

    return await this.prismaService.supportRequests.findMany({
      ...pagination,
      where,
      ...includeSubQueries,
    });
  }

  async getMessagesByChatId(chatId: number) {
    const result = await this.prismaService.supportRequests.findUnique({
      where: {
        id: chatId,
      },
      include: {
        chatMessages: {
          select: {
            text: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (result?.chatMessages) {
      return result.chatMessages;
    }
  }

  async addMessagesByChatId(chatId: number, userId: number, text: string) {
    const result = this.prismaService.chatMessages.create({
      data: {
        text,
        user: {
          connect: {
            id: userId,
          },
        },
        sentAt: new Date().toISOString(),
        supportRequest: {
          connect: {
            id: chatId,
          },
        },
      },
    });

    this.informAboutNewMessages(chatId, userId, text);

    return result;
  }

  async markAsRead(chatId: number, createdBefore: string) {
    console.log(new Date(createdBefore));

    const result = this.prismaService.chatMessages.updateMany({
      data: {
        readAt: new Date().toISOString(),
      },
      where: {
        supportRequestId: chatId,
        sentAt: {
          lte: new Date(createdBefore),
        },
      },
    });
    return result;
  }

  async getSecondUser(chatId, firstUserId) {
    const messages = await this.prismaService.supportRequests.findUnique({
      where: {
        id: chatId,
      },
      include: {
        chatMessages: {
          select: {
            userId: true,
          },
        },
      },
    });
    let secondUserId;
    if (messages?.chatMessages.length) {
      secondUserId = messages.chatMessages.find(
        (m) => m.userId !== firstUserId,
      );
    }
    return secondUserId?.userId;
  }

  async informAboutNewMessages(chatId, firstUserId, text) {
    const userToInform = await this.getSecondUser(chatId, firstUserId);
    const payload = {
      userId: userToInform,
      chatId: chatId,
      text: text,
    };
    this.eventEmitter.emit('support.InformAboutNewMessage', payload);
  }
}
