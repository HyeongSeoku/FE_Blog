import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { UsersService } from 'src/users/users.service';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';

describe('CommentsController', () => {
  let controller: CommentsController;

  const mockCommentsService = jest.fn();
  const mockUsersRepository = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        UsersService,
        { provide: CommentsService, useValue: mockCommentsService },
        { provide: getRepositoryToken(Users), useValue: mockUsersRepository },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
