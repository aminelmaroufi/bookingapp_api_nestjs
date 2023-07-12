import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsService {
  findAll() {
    return `This action returns all rooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
