import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { UsersModule } from 'src/users/users.module';
import { HotelsModule } from 'src/hotels/hotels.module';
import { AdminHotelsController } from './controllers/hotels.controller';
import config from 'src/config';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: config.uploads.path,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
    UsersModule,
    HotelsModule,
  ],
  controllers: [AdminController, AdminHotelsController],
  providers: [AdminService],
})
export class AdminModule {}
