import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from './schemas/file.schema';
import { FilesService } from './services/files.service';
import { FilesController } from './controllers/files.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'File', schema: FileSchema }])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
