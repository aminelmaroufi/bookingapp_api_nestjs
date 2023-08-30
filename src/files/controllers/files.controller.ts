import { Controller, Get, Param, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { FilesService } from '../services/files.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/config/http-exception.filter';

@ApiTags('files')
@UseFilters(HttpExceptionFilter)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id/view')
  async viewFile(
    @Param('id') fileId: string,
    @Res() res: Response,
  ): Promise<any> {
    // Get the file path based on the file ID
    const filename = await this.filesService.getFilePath(fileId);

    const filePath = path.join(process.cwd(), 'uploads/images', filename);

    // Stream the file back to the client
    res.sendFile(filePath);
  }
}
