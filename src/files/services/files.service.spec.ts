import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { getModelToken } from '@nestjs/mongoose';

const mockFileModel = () => ({
  saveFile: jest.fn(),
});

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: getModelToken('File'), useFactory: mockFileModel },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
