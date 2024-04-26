import { Test, TestingModule } from '@nestjs/testing';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';

describe('FollowersController', () => {
  let controller: FollowersController;

  const mockFollowersService = {
    following: jest.fn().mockResolvedValue(undefined),
    unFollowing: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowersController],
      providers: [
        { provide: FollowersService, useValue: mockFollowersService },
      ],
    }).compile();

    controller = module.get<FollowersController>(FollowersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
