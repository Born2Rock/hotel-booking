import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles-guard';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';
import { SupportService } from './support.service';
import { SearchParamsSupportRequestsDto } from './dto/search-params-support-requests.dto';

@Controller('')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/api/client/support-requests/')
  async createSupportRequest(@Request() req, @Body('text') text: string) {
    const { userId } = req.user;
    return await this.supportService.createSupportRequest(userId, text);
  }

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/api/client/support-requests/')
  async getUserSupportRequests(
    @Request() req,
    @Body() params: SearchParamsSupportRequestsDto,
  ) {
    const { userId } = req.user;
    return await this.supportService.getUserSupportRequests(params, userId);
  }

  @Roles('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/api/manager/support-requests/')
  async getManagerSupportRequests(
    @Body() params: SearchParamsSupportRequestsDto,
  ) {
    return await this.supportService.getUserSupportRequests(
      params,
      undefined,
      true,
    );
  }

  @Roles('client', 'manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/api/common/support-requests/:id/messages')
  async getMessagesByChatId(@Param('id', ParseIntPipe) chatId: number) {
    return await this.supportService.getMessagesByChatId(chatId);
  }

  @Roles('client', 'manager', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/api/common/support-requests/:id/messages')
  async addMessagesByChatId(
    @Request() req,
    @Body('text') text: string,
    @Param('id', ParseIntPipe) chatId: number,
  ) {
    const { userId } = req.user;
    return await this.supportService.addMessagesByChatId(chatId, userId, text);
  }

  @Roles('client', 'manager', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/api/common/support-requests/:id/messages/read')
  async markAsRead(
    @Body('createdBefore') createdBefore: string,
    @Param('id', ParseIntPipe) chatId: number,
  ) {
    return await this.supportService.markAsRead(chatId, createdBefore);
  }
}
