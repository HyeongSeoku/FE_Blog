import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../database/entities/user.entity';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: MockType<Repository<Users>>;

  const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
    () => ({
      create: jest.fn((entity) => entity),
      save: jest.fn((entity) =>
        Promise.resolve({ ...entity, userId: Date.now() }),
      ),
    }),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUsersRepository = module.get<MockType<Repository<Users>>>(
      getRepositoryToken(Users),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return that', async () => {
    const createUserDto = {
      username: 'test',
      password: 'test',
      email: 'test@test.com',
    };

    const createdUser = await service.create(createUserDto);

    expect(createdUser.username).toEqual(createUserDto.username);
    expect(createdUser.email).toEqual(createUserDto.email);

    // 비밀번호 필드를 제거한 createUserDto로 검증
    delete createUserDto.password;
    expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserDto); // create가 호출되었는지 검증
    expect(mockUsersRepository.save).toHaveBeenCalled(); // save가 호출되었는지 검증
  });
});
