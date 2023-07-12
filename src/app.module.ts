import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(config.db.uri),
    AdminModule,
    UsersModule,
    HotelsModule,
    RoomsModule,
    FilesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
