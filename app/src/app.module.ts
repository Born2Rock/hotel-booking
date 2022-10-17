import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationsModule } from './reservations/reservations.module';
import { SupportModule } from './support/support.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, HotelsModule, ReservationsModule, SupportModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
