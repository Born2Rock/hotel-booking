import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportGateway } from './support.gateway';
import { SupportController } from './support.controller';
import { PrismaService } from '../prisma.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [SupportGateway, SupportService, PrismaService],
  imports: [EventEmitterModule.forRoot()],
  controllers: [SupportController],
})
export class SupportModule {}
