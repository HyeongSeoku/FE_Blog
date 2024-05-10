import { Test, TestingModule } from "@nestjs/testing";
import { ViewsService } from "./views.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Views } from "src/database/entities/views.entity";
import { PostsService } from "src/posts/posts.service";

describe("ViewsService", () => {
  let service: ViewsService;

  const mockViewsRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockPostsService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViewsService,
        { provide: getRepositoryToken(Views), useValue: mockViewsRepository },
        PostsService,
        { provide: PostsService, useValue: mockPostsService },
      ],
    }).compile();

    service = module.get<ViewsService>(ViewsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
