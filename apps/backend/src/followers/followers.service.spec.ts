import { Test, TestingModule } from '@nestjs/testing';
import { FollowersService } from './followers.service';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Followers } from 'src/database/entities/followers.entity';
import { Users } from 'src/database/entities/user.entity';

describe('FollowersService', () => {
  let service: FollowersService;

  const mockFollowersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUsersRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowersService,
        UsersService,
        {
          provide: getRepositoryToken(Followers),
          useValue: mockFollowersRepository,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<FollowersService>(FollowersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
