import { Test, TestingModule } from "@nestjs/testing";
import { CommentsService } from "./comments.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Comments } from "src/database/entities/comments.entity";
import { Repository } from "typeorm";
import { PostsService } from "src/posts/posts.service";
import { Posts } from "src/database/entities/posts.entity";
import { Categories } from "src/database/entities/categories.entity";
import { TagsService } from "src/tags/tags.service";
import { ViewsService } from "src/views/views.service";
import { Views } from "src/database/entities/views.entity";
import { Tags } from "src/database/entities/tags.entity";

describe("CommentsService", () => {
  let service: CommentsService;
  let commentsRepository: Repository<Comments>;

  const mockCommentsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockPostsRepository = {
    findOne: jest.fn().mockResolvedValue(undefined),
  };

  //실질적으로 쓰이지 않아서 모킹만 진행
  const mockCategoriesRepository = jest.fn();
  const mockViewsRepository = jest.fn();
  const mockTagsRepository = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        PostsService,
        TagsService,
        ViewsService,
        {
          provide: getRepositoryToken(Comments),
          useValue: mockCommentsRepository,
        },
        {
          provide: getRepositoryToken(Posts),
          useValue: mockPostsRepository,
        },
        {
          provide: getRepositoryToken(Categories),
          useValue: mockCategoriesRepository,
        },
        { provide: getRepositoryToken(Views), useValue: mockViewsRepository },
        { provide: getRepositoryToken(Tags), useValue: mockTagsRepository },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get<Repository<Comments>>(
      getRepositoryToken(Comments),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
