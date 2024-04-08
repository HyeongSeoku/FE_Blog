import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comments } from 'src/database/entities/comments.entity';

describe('CommentsService', () => {
  let service: CommentsService;
  const mockCommentsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comments),
          useValue: mockCommentsRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
