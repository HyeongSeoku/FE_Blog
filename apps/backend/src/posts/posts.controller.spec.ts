import { Test, TestingModule } from "@nestjs/testing";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { NotFoundException } from "@nestjs/common";

describe("PostsController", () => {
  let controller: PostsController;
  let postsService: PostsService;

  const mockPostsService = {
    findAll: jest.fn().mockReturnValue(undefined),
    findOnePost: jest.fn().mockReturnValue(undefined),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
  };
  const VALID_POST_ID = "VALID_POST_ID";
  const INVALID_POST_ID = "INVALID_POST_ID";

  const MOCK_POSTS = [
    {
      postId: "qliaer12",
      title: "First post",
      body: "This is the first post",
      categoryKey: "DEVELOP",
      tags: ["Frontend", "React", "Next.js"],
      viewCount: 150,
    },
    {
      postId: "veonmas13",
      title: "Second post",
      body: "This is the second post",
      categoryKey: "DEVELOP",
      tags: ["Backend", "Nest.js"],
      viewCount: 75,
    },
    {
      postId: "vqopwenk445",
      title: "Third post",
      body: "This is the third post",
      categoryKey: "PHOTO",
      tags: [],
      viewCount: 0,
    },
    {
      postId: "vqopwenk445",
      title: "Third post",
      body: "This is the third post",
      categoryKey: "PHOTO",
      tags: [],
      viewCount: 0,
    },
    {
      postId: "vqopwenk445",
      title: "Fourth post",
      body: "This is the fourth post",
      categoryKey: "LIFE",
      tags: ["Park", "공원"],
      viewCount: 100,
    },
    {
      postId: VALID_POST_ID,
      title: "get postId target post",
      body: "This is the get postId target post",
      categoryKey: "DEVELOP",
      tags: [],
      viewCount: 125,
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("/GET posts getAllPosts", () => {
    it("/GET posts: throw NotFoundException when invalid request", async () => {
      const errorMessage = "No posts found for the given criteria";
      try {
        await controller.getAllPosts({
          categoryKey: "invalid",
          tagName: "invalid",
        });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response).toEqual({
          statusCode: 404,
          message: errorMessage,
        });
      }
    });

    it("/GET posts: get all post request", async () => {
      const query = {};

      const expectedData = {
        list: MOCK_POSTS,
        total: MOCK_POSTS.length,
      };
      mockPostsService.findAll.mockResolvedValue(expectedData);
      const result = await controller.getAllPosts(query);

      expect(mockPostsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedData);
    });

    it("/GET posts: get filtered post by category query request", async () => {
      const query = { categoryKey: "DEVELOP" };

      const filteredPost = MOCK_POSTS.filter(
        (post) => post.categoryKey === query.categoryKey,
      );

      const expectedData = {
        list: filteredPost,
        total: filteredPost.length,
      };
      mockPostsService.findAll.mockResolvedValue(expectedData);
      const result = await controller.getAllPosts(query);

      expect(mockPostsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedData);
    });

    it("/GET posts: get filtered post by category query request", async () => {
      const query = { tagName: "React" };

      const filteredPosts = MOCK_POSTS.filter((post) =>
        post.tags.includes(query.tagName),
      );

      const expectedData = {
        list: filteredPosts,
        total: filteredPosts.length,
      };

      mockPostsService.findAll.mockResolvedValue(expectedData);
      const result = await controller.getAllPosts(query);

      expect(mockPostsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedData);
    });
  });

  describe("/GET postId: getPost", () => {
    it("/GET postId: get valid post id", async () => {
      const expectedData = MOCK_POSTS.find(
        ({ postId }) => postId === VALID_POST_ID,
      );
      mockPostsService.findOnePost.mockResolvedValue(expectedData);

      const result = await controller.getPost(VALID_POST_ID);

      expect(mockPostsService.findOnePost).toHaveBeenCalledWith(VALID_POST_ID);
      expect(result).toEqual(expectedData);
    });

    it("/GET postId: get invalid post id", async () => {
      const expectedData = MOCK_POSTS.find(
        ({ postId }) => postId === INVALID_POST_ID,
      );
      mockPostsService.findOnePost.mockResolvedValue(expectedData);

      const errorMessage = "Post id does not exist!";

      try {
        await controller.getPost(INVALID_POST_ID);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response).toEqual({
          error: "Not Found",
          statusCode: 404,
          message: errorMessage,
        });
      }
    });
  });
});
