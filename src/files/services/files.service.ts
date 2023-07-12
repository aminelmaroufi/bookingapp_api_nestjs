import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { unlink } from 'fs';
import { promisify } from 'util';
import { File } from '../schemas/file.schema';
import { FileDto } from '../dto/file.dto';

const unlinkAsync = promisify(unlink);

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  async saveFile(filename: string): Promise<FileDto> {
    const newFile = new this.fileModel({ filename });
    return newFile.save();
  }

  async getFilePath(fileId: string): Promise<string> {
    const file = await this.fileModel.findById(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    return file.filename;
  }

  async deleteFile(fileId: string) {
    const selectedFile = await this.fileModel.findById(fileId);
    await unlinkAsync(`uploads/images/${selectedFile.filename}`);
    return await this.fileModel.findByIdAndDelete(selectedFile._id);
  }
}
